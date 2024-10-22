import {
  type FabricObject,
  type Canvas,
  type TOriginX,
  type TOriginY,
} from "fabric";
import Card from "../artwork-upload-mode/helpers/Cards";
import CustomBleedLine from "../artwork-upload-mode/helpers/customBleedLines";

export const cardsHandler = function (
  cardFrontRef: Ref<HTMLCanvasElement | null>,
  cardBackRef: Ref<HTMLCanvasElement | null>,
  resizeElement: () => void,
  modeType: string
) {
  interface CardData {
    cardSide: string;
    cardID: string;
    canvas: Canvas;
    loading: Ref<boolean>;
  }

  interface CustomLineOptions extends FabricObject {
    linePosition?: string;
    lineType?: string;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    stroke: string;
    strokeDashArray: number[];
    selectable: boolean;
    evented: boolean;
    originX: TOriginX;
    originY: TOriginY;
    opacity: number;
    strokeWidth: number;
    layout: boolean;
    padding: number;
  }

  interface jsonObject extends JSON {
    background: string;
    objects: object[];
    version: string;
  }

  interface CardDataWithoutRefs {
    cardSide: string;
    cardID: string;
    canvas: Canvas;
    loading: boolean;
  }

  interface cardHistory {
    cardSide: string;
    activeObject: CustomLineOptions | null;
    actionType?: string;
    json: JSON;
  }

  const actualSize = {
    width_mm: 120,
    height_mm: 120,
    dpi: 120,
  };

  const cardsData = ref<CardData[]>([]);
  const activeCardRef = ref<string>("");

  const cardHistoryIndex = ref<number>(-1);

  const jsonLoadingRef = ref<boolean>(false);
  const cardHistory = ref<cardHistory[]>([]);
  const canvasDimensionsRef = ref<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const activeObjectRef = ref<FabricObject | null>(null);
  const cardFrontThumbnail = ref<string | null>(null);
  const cardBackThumbnail = ref<string | null>(null);

  const initiateCards = async () => {
    const dataString = localStorage.getItem("cardsInfo");
    const localCardsData: {
      cardSide: string;
      cardID: string;
      cardJSON: JSON;
    }[] = JSON.parse(dataString!);

    const cardFront = new Card(
      actualSize,
      "Front",
      cardHistory as Ref<cardHistory[]>,
      cardHistoryIndex,
      jsonLoadingRef,
      cardFrontRef.value,
      modeType,
      activeObjectRef as Ref<FabricObject | null>,
      cardFrontThumbnail,
      cardBackThumbnail,
      cardsData as Ref<CardDataWithoutRefs[]>
    );

    const cardBack = new Card(
      actualSize,
      "Back",
      cardHistory as Ref<cardHistory[]>,
      cardHistoryIndex,
      jsonLoadingRef,
      cardBackRef.value,
      modeType,
      activeObjectRef as Ref<FabricObject | null>,
      cardFrontThumbnail,
      cardBackThumbnail,
      cardsData as Ref<CardDataWithoutRefs[]>
    );
    if (cardFront.canvas && cardBack.canvas)
      cardsData.value = [
        {
          cardSide: cardFront.cardSide,
          cardID: cardFront.cardID,
          canvas: cardFront.canvas,
          loading: cardFront.loading.value,
        },

        {
          cardSide: cardBack.cardSide,
          cardID: cardBack.cardID,
          canvas: cardBack.canvas,
          loading: cardBack.loading.value,
        },
      ];

    if (cardFront.canvas)
      canvasDimensionsRef.value = {
        width: cardFront.canvas.width,
        height: cardFront.canvas.height,
      };

    if (localCardsData) {
      jsonLoadingRef.value = true;

      await Promise.all(
        cardsData.value.map(async (card, index) => {
          await card.canvas
            .loadFromJSON(localCardsData[index].cardJSON)
            .then(() => {
              if (card.canvas) {
                card.canvas.requestRenderAll();
                jsonLoadingRef.value = false;
              }
            });
        })
      );
      jsonLoadingRef.value = false;
    } else {
      jsonLoadingRef.value = true;
      cardsData.value.map((card) => {
        if (card && card.canvas && card.canvas.width) {
          const bleedLinesHandler = new CustomBleedLine();

          const lines = bleedLinesHandler.addBleedLines(
            card.canvas.width,
            card.canvas.height,
            20
          );

          lines.map((line) => {
            card.canvas.add(line);
            card.canvas.bringObjectToFront(line);
          });
        }
      });
      jsonLoadingRef.value = false;
    }

    activeCardRef.value = "Front";

    setTimeout(() => {
      resizeElement();
    }, 0);
  };

  const loadFromJson = async (action: string) => {
    const latestIndex = cardHistoryIndex.value + 1;
    const currentHistoryObject =
      cardHistory.value[cardHistoryIndex.value] &&
      cardHistory.value[cardHistoryIndex.value].activeObject;
    const latestHistoryObject =
      cardHistory.value[cardHistoryIndex.value + 1] &&
      cardHistory.value[cardHistoryIndex.value + 1].activeObject;

    if (action === "undo") {
      for (let i = cardHistoryIndex.value; i >= 0; i--) {
        if (
          cardHistory.value[i].cardSide ===
          cardHistory.value[latestIndex].cardSide
        ) {
          const canvas =
            cardHistory.value[
              cardHistoryIndex.value <= 1 ? cardHistoryIndex.value : i
            ].cardSide === "Front"
              ? cardsData.value[0].canvas
              : cardsData.value[1].canvas;

          jsonLoadingRef.value = true;

          // Wait for the canvas to load and render before continuing
          await canvas
            .loadFromJSON(
              cardHistoryIndex.value <= 1
                ? cardHistory.value[cardHistoryIndex.value].json
                : cardHistory.value[i].json
            )
            .then(() => {
              jsonLoadingRef.value = false;
              canvas && canvas.requestRenderAll();
            });

          const desiredHistoryObject = cardHistory.value[i].activeObject;

          if (
            desiredHistoryObject &&
            desiredHistoryObject.lineType !== "perforation"
          )
            activeCardRef.value = cardHistory.value[i].cardSide;

          break; // Exit the outer loop after the first match is processed
        } else if (
          cardHistory.value[cardHistoryIndex.value - 1].activeObject === null &&
          currentHistoryObject &&
          currentHistoryObject.lineType !== "perforation" &&
          (latestHistoryObject === null ||
            (latestHistoryObject &&
              latestHistoryObject.lineType !== "perforation"))
        ) {
          cardHistoryIndex.value -= 1;

          const canvas =
            cardHistory.value[cardHistoryIndex.value].cardSide === "Front"
              ? cardsData.value[0].canvas
              : cardsData.value[1].canvas;

          jsonLoadingRef.value = true;

          // Wait for the canvas to load and render before continuing
          await canvas
            .loadFromJSON(cardHistory.value[cardHistoryIndex.value].json)
            .then(() => {
              jsonLoadingRef.value = false;
              canvas && canvas.requestRenderAll();
            });

          const desiredHistory = cardHistory.value[cardHistoryIndex.value];
          const desiredObject = desiredHistory.activeObject;

          if (
            !desiredObject ||
            (desiredObject && desiredObject.lineType !== "perforation")
          )
            activeCardRef.value = desiredHistory.cardSide;

          break;
        }
      }
    } else {
      const historyToLoad = cardHistory.value[cardHistoryIndex.value];

      const desiredCard = cardsData.value.find((p) => {
        return p.cardSide === historyToLoad.cardSide;
      });

      const upperHistory = cardHistory.value[cardHistoryIndex.value + 1];
      const upperHistoryObject = upperHistory && upperHistory.activeObject;

      if (
        desiredCard &&
        upperHistoryObject &&
        upperHistoryObject.lineType !== "perforation" &&
        latestHistoryObject &&
        latestHistoryObject.lineType !== "perforation" &&
        currentHistoryObject &&
        currentHistoryObject.lineType !== "perforation"
      )
        activeCardRef.value = desiredCard.cardSide;

      jsonLoadingRef.value = true;

      if (desiredCard)
        await desiredCard.canvas.loadFromJSON(historyToLoad.json).then(() => {
          const canvas = desiredCard.canvas;
          if (canvas) {
            canvas.requestRenderAll();
            jsonLoadingRef.value = false;
          }
        });
    }
  };

  const undoCardHistory = async () => {
    if (jsonLoadingRef.value) return;
    if (cardHistory.value && cardHistoryIndex.value > 0) {
      cardHistoryIndex.value -= 1;

      const currentHistoryObject =
        cardHistory.value[cardHistoryIndex.value] &&
        cardHistory.value[cardHistoryIndex.value].activeObject;

      const latestHistoryObject =
        cardHistory.value[cardHistoryIndex.value + 1] &&
        cardHistory.value[cardHistoryIndex.value + 1].activeObject;

      const latestHistoryActionType =
        cardHistory.value[cardHistoryIndex.value + 1] &&
        cardHistory.value[cardHistoryIndex.value + 1].actionType;

      const nextUndoObject =
        cardHistory.value[cardHistoryIndex.value - 1] &&
        cardHistory.value[cardHistoryIndex.value - 1].activeObject;

      const twoUndosObject =
        cardHistory.value[cardHistoryIndex.value - 2] &&
        cardHistory.value[cardHistoryIndex.value - 2].activeObject;

      // CONDITION 1: IF PERFORATION LINE IS PRESENT AFTER UNDO OR THE OBJECT IS NULL
      if (
        currentHistoryObject &&
        currentHistoryObject.lineType === "perforation"
      ) {
        // IF COND 1 IS true AND PERFORATION LINE IS PRESENT IN LATEST INDEX AND THAT LINE IS MODIFIED
        if (
          latestHistoryObject &&
          latestHistoryObject.lineType === "perforation" &&
          latestHistoryActionType === "modified"
        ) {
          for (let i = cardHistoryIndex.value - 1; i >= 0; i--) {
            if (
              cardHistory.value[i].cardSide !==
              cardHistory.value[cardHistoryIndex.value].cardSide
            ) {
              const canvas =
                cardHistory.value[i].cardSide === "Front"
                  ? cardsData.value[0].canvas
                  : cardsData.value[1].canvas;

              jsonLoadingRef.value = true;

              await canvas.loadFromJSON(cardHistory.value[i].json).then(() => {
                jsonLoadingRef.value = false;
              });
              canvas && canvas.requestRenderAll();

              break;
            }
          }

          cardHistoryIndex.value -= 1;
        } else if (
          currentHistoryObject.lineType !== "perforation" &&
          nextUndoObject &&
          nextUndoObject.lineType === "perforation"
        ) {
          // IF COND 1 IS true, PHASE 2: IF PERFORATION LINE IS PRESENT 2 INDEXES BELOW LATEST OR NOT

          // IF COND 1 PHASE 2 IS true, PHASE 3: IF PERFORATION LINE IS PRESENT 3 INDEXES BELOW LATEST OR NOT
          if (twoUndosObject && twoUndosObject.lineType === "perforation") {
            const canvas =
              cardHistory.value[cardHistoryIndex.value - 2].cardSide === "Front"
                ? cardsData.value[0].canvas
                : cardsData.value[1].canvas;

            jsonLoadingRef.value = true;

            // Wait for the canvas to load and render before continuing
            await canvas
              .loadFromJSON(cardHistory.value[cardHistoryIndex.value - 2].json)
              .then(() => {
                jsonLoadingRef.value = false;
              });
            canvas && canvas.requestRenderAll();

            cardHistoryIndex.value -= 1;
          } else {
            // IF OBJECT IS NULL 4 INDEXES BELOW LATEST THEN RUN LOOPS ELSE DO NOTHING
            if (
              cardHistory.value[cardHistoryIndex.value - 3].activeObject ===
                null &&
              latestHistoryObject &&
              latestHistoryObject.lineType === "perforation"
            ) {
              const indexToStartFrom = cardHistory.value.indexOf(
                cardHistory.value[cardHistoryIndex.value]
              );

              for (let i = indexToStartFrom - 1; i >= 0; i--) {
                if (
                  cardHistory.value[i].cardSide ===
                  cardHistory.value[indexToStartFrom].cardSide
                ) {
                  const canvas =
                    cardHistory.value[i].cardSide === "Front"
                      ? cardsData.value[0].canvas
                      : cardsData.value[1].canvas;

                  jsonLoadingRef.value = true;

                  // Wait for the canvas to load and render before continuing
                  await canvas
                    .loadFromJSON(cardHistory.value[i].json)
                    .then(() => {
                      jsonLoadingRef.value = false;
                    });
                  canvas && canvas.requestRenderAll();

                  // Now that the canvas loading is done, we can safely start the inner loop
                  for (let j = indexToStartFrom - 1; j >= 0; j--) {
                    if (
                      cardHistory.value[j].cardSide !==
                      cardHistory.value[indexToStartFrom].cardSide
                    ) {
                      const canvas =
                        cardHistory.value[j].cardSide === "Front"
                          ? cardsData.value[0].canvas
                          : cardsData.value[1].canvas;

                      jsonLoadingRef.value = true;

                      // Wait for the canvas to load and render before breaking
                      await canvas
                        .loadFromJSON(cardHistory.value[j].json)
                        .then(() => {
                          jsonLoadingRef.value = false;
                        });
                      canvas && canvas.requestRenderAll();

                      break; // Exit the inner loop after loading from the JSON
                    }
                  }

                  break; // Exit the outer loop after the first match is processed
                }
              }
              cardHistoryIndex.value -= 1;
            }
          }

          // CONDITION 1 PHASE 3 ENDS
        } else {
          if (
            cardHistory.value[cardHistoryIndex.value + 1].actionType ===
            "modified"
          ) {
            for (let i = cardHistoryIndex.value; i >= 0; i--) {
              if (
                cardHistory.value[i].cardSide ===
                cardHistory.value[cardHistoryIndex.value + 1].cardSide
              ) {
                const canvas =
                  cardHistory.value[i].cardSide === "Front"
                    ? cardsData.value[0].canvas
                    : cardsData.value[1].canvas;

                jsonLoadingRef.value = true;

                // Wait for the canvas to load and render before continuing
                await canvas
                  .loadFromJSON(cardHistory.value[i].json)
                  .then(() => {
                    jsonLoadingRef.value = false;
                  });
                canvas && canvas.requestRenderAll();

                break; // Exit the outer loop after the first match is processed
              }
            }

            cardHistoryIndex.value -= 1;
          } else {
            const indexToStartFrom = cardHistory.value.indexOf(
              cardHistory.value[cardHistoryIndex.value]
            );

            if (
              latestHistoryObject &&
              latestHistoryObject.lineType === "perforation"
            ) {
              for (let i = indexToStartFrom - 1; i >= 0; i--) {
                if (
                  cardHistory.value[i].cardSide ===
                  cardHistory.value[indexToStartFrom].cardSide
                ) {
                  const canvas =
                    cardHistory.value[i].cardSide === "Front"
                      ? cardsData.value[0].canvas
                      : cardsData.value[1].canvas;

                  jsonLoadingRef.value = true;

                  // Wait for the canvas to load and render before continuing
                  await canvas.loadFromJSON(cardHistory.value[i].json).then;
                  canvas && canvas.requestRenderAll();
                  jsonLoadingRef.value = false;

                  // Now that the canvas loading is done, we can safely start the inner loop
                  for (let j = indexToStartFrom - 1; j >= 0; j--) {
                    if (
                      cardHistory.value[j].cardSide !==
                      cardHistory.value[indexToStartFrom].cardSide
                    ) {
                      const canvas =
                        cardHistory.value[j].cardSide === "Front"
                          ? cardsData.value[0].canvas
                          : cardsData.value[1].canvas;

                      jsonLoadingRef.value = true;

                      // Wait for the canvas to load and render before breaking
                      await canvas.loadFromJSON(cardHistory.value[j].json);
                      canvas && canvas.requestRenderAll();
                      jsonLoadingRef.value = false;

                      break; // Exit the inner loop after loading from the JSON
                    }
                  }

                  break; // Exit the outer loop after the first match is processed
                }
              }
              cardHistoryIndex.value -= 1;
            }
          }
        }
        // CONDITION 1 PHASE 2 ENDS
      } else if (!cardHistory.value[cardHistoryIndex.value].activeObject) {
        if (
          cardHistory.value[cardHistoryIndex.value - 1] &&
          cardHistory.value[cardHistoryIndex.value - 1].activeObject !== null &&
          nextUndoObject &&
          nextUndoObject.lineType === "perforation"
        ) {
          if (
            !cardHistory.value[cardHistoryIndex.value - 2].activeObject ||
            (twoUndosObject && twoUndosObject.lineType !== "perforation")
          ) {
            const canvas =
              cardHistory.value[cardHistoryIndex.value].cardSide === "Front"
                ? cardsData.value[0].canvas
                : cardsData.value[1].canvas;

            jsonLoadingRef.value = true;

            // Wait for the canvas to load and render before continuing
            await canvas.loadFromJSON(
              cardHistory.value[cardHistoryIndex.value].json
            );
            canvas && canvas.requestRenderAll();
            jsonLoadingRef.value = false;
            cardHistoryIndex.value -= 2;
          }
        }
      }

      const upperJson = cardHistory.value[cardHistoryIndex.value + 1]
        .json as jsonObject;

      const currentJson = cardHistory.value[cardHistoryIndex.value]
        .json as jsonObject;

      if (currentJson.objects.length < 7 && upperJson.objects.length < 7) {
        cardHistoryIndex.value += 1;
      } else {
        await loadFromJson("undo");
      }
    }
  };

  const reDoCardHistory = async () => {
    if (jsonLoadingRef.value) return;

    if (
      cardHistory.value &&
      cardHistoryIndex.value < cardHistory.value.length - 1
    ) {
      cardHistoryIndex.value += 1;

      await loadFromJson("redo");

      const currentHistoryObject =
        cardHistory.value[cardHistoryIndex.value] &&
        cardHistory.value[cardHistoryIndex.value].activeObject;
      const twoRedosObject =
        cardHistory.value[cardHistoryIndex.value + 2] &&
        cardHistory.value[cardHistoryIndex.value + 2].activeObject;

      if (
        currentHistoryObject &&
        currentHistoryObject.lineType === "perforation"
      ) {
        if (
          !cardHistory.value[cardHistoryIndex.value + 1].activeObject &&
          twoRedosObject &&
          twoRedosObject.lineType === "perforation"
        ) {
          cardHistoryIndex.value += 1;
          cardHistoryIndex.value += 1;

          const canvas =
            cardHistory.value[cardHistoryIndex.value].cardSide === "Front"
              ? cardsData.value[0].canvas
              : cardsData.value[1].canvas;

          jsonLoadingRef.value = true;

          // Wait for the canvas to load and render before breaking
          await canvas.loadFromJSON(
            cardHistory.value[cardHistoryIndex.value].json
          );
          canvas && canvas.requestRenderAll();
          jsonLoadingRef.value = false;
        } else {
          cardHistoryIndex.value += 1;

          const canvas =
            cardHistory.value[cardHistoryIndex.value].cardSide === "Front"
              ? cardsData.value[0].canvas
              : cardsData.value[1].canvas;

          jsonLoadingRef.value = true;
          // Wait for the canvas to load and render before breaking
          await canvas.loadFromJSON(
            cardHistory.value[cardHistoryIndex.value].json
          );
          canvas && canvas.requestRenderAll();
          jsonLoadingRef.value = false;
        }
      }
    }
  };

  return {
    initiateCards,
    undoCardHistory,
    reDoCardHistory,
    cardsData,
    activeObjectRef,
    cardFrontThumbnail,
    cardBackThumbnail,
    cardHistory,
    cardHistoryIndex,
    canvasDimensionsRef,
    activeCardRef,
  };
};
