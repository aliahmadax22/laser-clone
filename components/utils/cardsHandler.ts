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
    width_mm: 150,
    height_mm: 150,
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

    console.log("local data for Cards", localCardsData);

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

    cardsData.value = [
      {
        cardSide: cardFront.cardSide,
        cardID: cardFront.cardID,
        canvas: cardFront.canvas!,
        loading: cardFront.loading.value,
      },

      {
        cardSide: cardBack.cardSide,
        cardID: cardBack.cardID,
        canvas: cardBack.canvas!,
        loading: cardBack.loading.value,
      },
    ];

    if (cardFront.canvas)
      canvasDimensionsRef.value = {
        width: cardFront.canvas.width,
        height: cardFront.canvas?.height,
      };

    if (localCardsData) {
      cardsData.value.map(async (card, index) => {
        jsonLoadingRef.value = true;

        await card?.canvas
          .loadFromJSON(localCardsData[index].cardJSON)
          .then(() => {
            card.canvas && card.canvas.requestRenderAll();

            jsonLoadingRef.value = false;
          });
      });
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

          lines?.map((line) => {
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
    console.log("load from json action", action);

    console.log("CURRENT ACTION INDEX", cardHistoryIndex.value);

    const latestIndex = cardHistoryIndex.value + 1;

    console.log("latest ACTION INDEX", latestIndex);
    if (action === "undo") {
      for (let i = cardHistoryIndex.value; i >= 0; i--) {
        console.log(
          "looped undo verification",
          cardHistory.value[i].cardSide ===
            cardHistory.value[latestIndex].cardSide
        );

        if (
          cardHistory.value[i].cardSide ===
          cardHistory.value[latestIndex].cardSide
        ) {
          console.log("looped undo occured");

          const canvas =
            cardHistory.value[
              cardHistoryIndex.value <= 1 ? cardHistoryIndex.value : i
            ].cardSide === "Front"
              ? cardsData.value[0].canvas
              : cardsData.value[1].canvas;

          console.log(
            "index of History that we are loading",
            cardHistory.value.indexOf(cardHistory.value[i])
          );

          jsonLoadingRef.value = true;

          // Wait for the canvas to load and render before continuing
          await canvas.loadFromJSON(
            cardHistoryIndex.value <= 1
              ? cardHistory.value[cardHistoryIndex.value].json
              : cardHistory.value[i].json
          );
          canvas && canvas.requestRenderAll();
          jsonLoadingRef.value = false;

          if (cardHistory.value[i].activeObject?.lineType !== "perforation")
            activeCardRef.value = cardHistory.value[i].cardSide;

          console.log("active card side", activeCardRef.value);

          break; // Exit the outer loop after the first match is processed
        } else if (
          cardHistory.value[cardHistoryIndex.value - 1].activeObject === null &&
          cardHistory.value[cardHistoryIndex.value].activeObject?.lineType !==
            "perforation" &&
          cardHistory.value[cardHistoryIndex.value + 1].activeObject
            ?.lineType !== "perforation"
        ) {
          console.log(
            "history before current index is null and there are no perforation lines in current and latest indexes"
          );

          cardHistoryIndex.value--;
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

          if (
            cardHistory.value[cardHistoryIndex.value].activeObject?.lineType !==
            "perforation"
          )
            activeCardRef.value =
              cardHistory.value[cardHistoryIndex.value].cardSide;

          break;
        }
      }
    } else {
      const historyToLoad = cardHistory.value[cardHistoryIndex.value];

      const desiredCard = cardsData.value.find((p) => {
        return p.cardSide === historyToLoad.cardSide;
      });

      console.log("DESIRED CARD", desiredCard?.cardSide);

      const upperHistory = cardHistory.value[cardHistoryIndex.value + 1];

      if (upperHistory?.activeObject?.lineType === "perforation") {
        activeCardRef.value = upperHistory.cardSide;
      } else {
        activeCardRef.value = desiredCard!.cardSide;
      }

      if (desiredCard) desiredCard.loading = true;
      jsonLoadingRef.value = true;
      // console.log("page loading value brfore json loading", desiredCard?.loading);

      desiredCard?.canvas.clear();

      await desiredCard?.canvas.loadFromJSON(historyToLoad.json).then(() => {
        desiredCard.canvas && desiredCard.canvas.requestRenderAll();

        if (desiredCard) desiredCard.loading = false;
        jsonLoadingRef.value = false;
        // console.log("page loading value after json loading", desiredCard.loading);
      });
    }
  };

  const undoCardHistory = async () => {
    if (cardHistory.value && cardHistoryIndex.value > 0) {
      cardHistoryIndex.value--;

      console.log("HISTORY", cardHistory.value, cardHistoryIndex.value);

      // CONDITION 1: IF PERFORATION LINE IS PRESENT AFTER UNDO OR THE OBJECT IS NULL
      if (
        cardHistory.value[cardHistoryIndex.value].activeObject?.lineType ===
        "perforation"
      ) {
        // IF COND 1 IS true AND PERFORATION LINE IS PRESENT IN LATEST INDEX AND THAT LINE IS MODIFIED
        if (
          cardHistory.value[cardHistoryIndex.value + 1].activeObject
            ?.lineType === "perforation" &&
          cardHistory.value[cardHistoryIndex.value + 1]?.actionType ===
            "modified"
        ) {
          console.log(
            "PERFORATION LINE IS PRESENT IN LATEST INDEX AND THAT LINE IS MODIFIED"
          );

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

              await canvas.loadFromJSON(cardHistory.value[i].json);
              canvas && canvas.requestRenderAll();
              jsonLoadingRef.value = false;

              console.log("loading the history index", i);

              break;
            }
          }

          cardHistoryIndex.value--;
        } else if (
          cardHistory.value[cardHistoryIndex.value - 1].activeObject
            ?.lineType === "perforation"
        ) {
          // IF COND 1 IS true, PHASE 2: IF PERFORATION LINE IS PRESENT 2 INDEXES BELOW LATEST OR NOT

          console.log(
            "line is also present in next undo",
            cardHistory.value[cardHistoryIndex.value]
          );

          // IF COND 1 PHASE 2 IS true, PHASE 3: IF PERFORATION LINE IS PRESENT 3 INDEXES BELOW LATEST OR NOT
          if (
            cardHistory.value[cardHistoryIndex.value - 2].activeObject
              ?.lineType === "perforation"
          ) {
            console.log(
              "another line is also present in double next undo i.e mirror line modification occured",
              cardHistoryIndex.value - 2
            );

            const canvas =
              cardHistory.value[cardHistoryIndex.value - 2].cardSide === "Front"
                ? cardsData.value[0].canvas
                : cardsData.value[1].canvas;

            jsonLoadingRef.value = true;

            // Wait for the canvas to load and render before continuing
            await canvas.loadFromJSON(
              cardHistory.value[cardHistoryIndex.value - 2].json
            );
            canvas && canvas.requestRenderAll();
            jsonLoadingRef.value = false;
            cardHistoryIndex.value--;
          } else {
            console.log(
              "another line is NOTTT present 3 indexes below LATEST index",
              cardHistory.value[cardHistoryIndex.value - 2]
            );

            // IF OBJECT IS NULL 4 INDEXES BELOW LATEST THEN RUN LOOPS ELSE DO NOTHING
            if (
              cardHistory.value[cardHistoryIndex.value - 3].activeObject ===
                null &&
              cardHistory.value[cardHistoryIndex.value + 1].activeObject
                ?.lineType === "perforation"
            ) {
              console.log(
                "OBJECT IS NULL 4 INDEXES BELOW LATEST so RUNNING LOOP"
              );

              const indexToStartFrom = cardHistory.value.indexOf(
                cardHistory.value[cardHistoryIndex.value]
              );

              for (let i = indexToStartFrom - 1; i >= 0; i--) {
                if (
                  cardHistory.value[i].cardSide ===
                  cardHistory.value[indexToStartFrom].cardSide
                ) {
                  console.log("desired history chunk", cardHistory.value[i]);
                  console.log(
                    "index of desired chunk",
                    cardHistory.value.indexOf(cardHistory.value[i])
                  );

                  const canvas =
                    cardHistory.value[i].cardSide === "Front"
                      ? cardsData.value[0].canvas
                      : cardsData.value[1].canvas;

                  jsonLoadingRef.value = true;

                  // Wait for the canvas to load and render before continuing
                  await canvas.loadFromJSON(cardHistory.value[i].json);
                  canvas && canvas.requestRenderAll();
                  jsonLoadingRef.value = false;

                  // Now that the canvas loading is done, we can safely start the inner loop
                  for (let j = indexToStartFrom - 1; j >= 0; j--) {
                    console.log(
                      "j loop condition ",
                      cardHistory.value[j].cardSide !==
                        cardHistory.value[indexToStartFrom].cardSide,
                      i - 1
                    );

                    if (
                      cardHistory.value[j].cardSide !==
                      cardHistory.value[indexToStartFrom].cardSide
                    ) {
                      console.log(
                        "side not matched j loop",
                        cardHistory.value[j]
                      );
                      console.log(
                        "history index in j loop",
                        cardHistory.value.indexOf(cardHistory.value[j])
                      );

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
              cardHistoryIndex.value--;
            }
          }
          // CONDITION 1 PHASE 3 ENDS
        } else {
          console.log("LINE IS NOT PRESENT 2 INDEXES BELOW LATEST");

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
                await canvas.loadFromJSON(cardHistory.value[i].json);
                canvas && canvas.requestRenderAll();
                jsonLoadingRef.value = false;

                break; // Exit the outer loop after the first match is processed
              }
            }

            cardHistoryIndex.value--;
          } else {
            const indexToStartFrom = cardHistory.value.indexOf(
              cardHistory.value[cardHistoryIndex.value]
            );

            if (
              cardHistory.value[cardHistoryIndex.value + 1].activeObject
                ?.lineType === "perforation"
            ) {
              console.log(
                "object of latest index is perforation line. working on removing the lines "
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
                  await canvas.loadFromJSON(cardHistory.value[i].json);
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
              cardHistoryIndex.value--;
            }
          }
        }
        // CONDITION 1 PHASE 2 ENDS
      } else if (!cardHistory.value[cardHistoryIndex.value].activeObject) {
        console.log(
          "active object is null i.e first ever object in that canvas",
          cardHistory.value[cardHistoryIndex.value]
        );

        if (
          cardHistory.value[cardHistoryIndex.value - 1] &&
          cardHistory.value[cardHistoryIndex.value - 1].activeObject !== null &&
          cardHistory.value[cardHistoryIndex.value - 1].activeObject
            ?.lineType === "perforation"
        ) {
          console.log("line present 1 index under", cardHistoryIndex.value - 1);

          if (
            !cardHistory.value[cardHistoryIndex.value - 2].activeObject ||
            cardHistory.value[cardHistoryIndex.value - 2].activeObject
              ?.lineType !== "perforation"
          ) {
            console.log(
              "object is null or no line present 2 indexes under",
              cardHistoryIndex.value - 2
            );
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
            cardHistoryIndex.value--;
            cardHistoryIndex.value--;
          }
        }
      }

      const upperJson = cardHistory.value[cardHistoryIndex.value + 1]
        .json as jsonObject;

      const currentJson = cardHistory.value[cardHistoryIndex.value]
        .json as jsonObject;

      if (
        // upcomingJson.objects.length < 7 &&
        currentJson.objects.length < 7 &&
        upperJson.objects.length < 7
      ) {
        cardHistoryIndex.value++;
        console.log("length less than 7", cardHistoryIndex.value);
      } else {
        console.log("action index during undo", cardHistoryIndex.value);

        loadFromJson(
          // cardHistory.value[cardHistoryIndex.value - 2]?.activeObject
          //   ?.lineType !== "perforation" &&
          //   cardHistory.value[cardHistoryIndex.value - 2]?.activeObject !==
          //     null &&
          //   cardHistoryIndex.value - 2 > 1
          //   ? "perforation"
          //   :
          "undo"
        );
      }
    }
  };

  //Redo - still notworking
  const reDoCardHistory = async () => {
    if (
      cardHistory.value &&
      cardHistoryIndex.value < cardHistory.value.length - 1
    ) {
      cardHistoryIndex.value++;

      await loadFromJson("redo");

      if (
        cardHistory.value[cardHistoryIndex.value].activeObject?.lineType ===
        "perforation"
      ) {
        if (
          !cardHistory.value[cardHistoryIndex.value + 1].activeObject &&
          cardHistory.value[cardHistoryIndex.value + 2].activeObject
            ?.lineType === "perforation"
        ) {
          cardHistoryIndex.value++;
          cardHistoryIndex.value++;

          jsonLoadingRef.value = true;

          console.log(
            "HISTORY after both lines were added at empty canvases",
            cardHistory.value,
            cardHistoryIndex.value
          );

          const canvas =
            cardHistory.value[cardHistoryIndex.value].cardSide === "Front"
              ? cardsData.value[0].canvas
              : cardsData.value[1].canvas;

          // Wait for the canvas to load and render before breaking
          await canvas.loadFromJSON(
            cardHistory.value[cardHistoryIndex.value].json
          );
          canvas && canvas.requestRenderAll();
        } else {
          cardHistoryIndex.value++;

          jsonLoadingRef.value = true;

          console.log("HISTORY", cardHistory.value, cardHistoryIndex.value);

          const canvas =
            cardHistory.value[cardHistoryIndex.value].cardSide === "Front"
              ? cardsData.value[0].canvas
              : cardsData.value[1].canvas;

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
