import {
  type FabricObject,
  type Canvas,
  type TOriginX,
  type TOriginY,
} from "fabric";
import Cover from "../artwork-upload-mode/helpers/Cover";
import SnaplinesBeta from "../artwork-upload-mode/helpers/snapsbeta";

export const coverHandler = function (
  coverLeftRef: Ref<HTMLCanvasElement | null>,
  coverMidRef: Ref<HTMLCanvasElement | null>,
  coverRightRef: Ref<HTMLCanvasElement | null>,
  resizeElement: () => void,
  modeType: string
) {
  interface coverData {
    coverSide: string;
    coverID: string;
    canvas: Canvas;
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

  interface coverDataWithoutRefs {
    coverSide: string;
    coverID: string;
    canvas: Canvas;
  }

  interface coverHistory {
    coverSide: string;
    activeObject: CustomLineOptions | null;
    json: JSON;
  }

  const actualSize = {
    width_mm: 120,
    height_mm: 120,
    dpi: 120,
  };

  const middleSize = {
    width_mm: 40,
    height_mm: 120,
    dpi: 120,
  };

  const coversData = ref<coverData[]>([]);
  const activeCoverRef = ref<string>("");

  const coverHistoryIndex = ref<number>(-1);

  const jsonLoadingRef = ref<boolean>(false);
  const coverHistory = ref<coverHistory[]>([]);
  const canvasDimensionsRef = ref<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const activeObjectRef = ref<FabricObject | null>(null);
  const coverLeftThumbnail = ref<string | null>(null);
  const coverMiddleThumbnail = ref<string | null>(null);
  const coverRightThumbnail = ref<string | null>(null);

  const initiateCover = async () => {
    const dataString = localStorage.getItem("coverInfo");
    const localCoverData: {
      coverSide: string;
      coverID: string;
      coverJSON: JSON;
    }[] = JSON.parse(dataString!);

    const coverLeft = new Cover(
      actualSize,
      "Left",
      coverHistory as Ref<coverHistory[]>,
      coverHistoryIndex,
      jsonLoadingRef,
      coverLeftRef.value,
      modeType,
      activeObjectRef as Ref<FabricObject | null>,
      coverLeftThumbnail,
      coverMiddleThumbnail,
      coverRightThumbnail,
      coversData as Ref<coverDataWithoutRefs[]>,
      activeCoverRef as Ref<string>
    );

    const coverMiddle = new Cover(
      middleSize,
      "Middle",
      coverHistory as Ref<coverHistory[]>,
      coverHistoryIndex,
      jsonLoadingRef,
      coverMidRef.value,
      modeType,
      activeObjectRef as Ref<FabricObject | null>,
      coverLeftThumbnail,
      coverMiddleThumbnail,
      coverRightThumbnail,
      coversData as Ref<coverDataWithoutRefs[]>,
      activeCoverRef as Ref<string>
    );

    const coverRight = new Cover(
      actualSize,
      "Right",
      coverHistory as Ref<coverHistory[]>,
      coverHistoryIndex,
      jsonLoadingRef,
      coverRightRef.value,
      modeType,
      activeObjectRef as Ref<FabricObject | null>,
      coverLeftThumbnail,
      coverMiddleThumbnail,
      coverRightThumbnail,
      coversData as Ref<coverDataWithoutRefs[]>,
      activeCoverRef as Ref<string>
    );

    if (coverLeft.canvas && coverRight.canvas && coverMiddle.canvas)
      coversData.value = [
        {
          coverSide: coverLeft.coverSide,
          coverID: coverLeft.coverID,
          canvas: coverLeft.canvas,
        },

        {
          coverSide: coverMiddle.coverSide,
          coverID: coverMiddle.coverID,
          canvas: coverMiddle.canvas,
        },

        {
          coverSide: coverRight.coverSide,
          coverID: coverRight.coverID,
          canvas: coverRight.canvas,
        },
      ];

    if (coverLeft.canvas)
      canvasDimensionsRef.value = {
        width: coverLeft.canvas.width,
        height: coverLeft.canvas.height,
      };

    if (localCoverData) {
      coversData.value.map(async (cover, index) => {
        jsonLoadingRef.value = true;

        if (cover)
          await cover.canvas
            .loadFromJSON(localCoverData[index].coverJSON)
            .then(() => {
              cover.canvas && cover.canvas.requestRenderAll();

              jsonLoadingRef.value = false;
            });
      });
    }

    activeCoverRef.value = "Left";

    setTimeout(() => {
      resizeElement();
    }, 0);
  };

  const loadFromJson = async (action: string) => {
    const latestIndex = coverHistoryIndex.value + 1;
    const currentHistoryObject =
      coverHistory.value[coverHistoryIndex.value] &&
      coverHistory.value[coverHistoryIndex.value].activeObject;

    const latestHistoryObject =
      coverHistory.value[coverHistoryIndex.value + 1] &&
      coverHistory.value[coverHistoryIndex.value + 1].activeObject;

    if (action === "undo") {
      for (let i = coverHistoryIndex.value; i >= 0; i--) {
        if (
          coverHistory.value[i].coverSide ===
          coverHistory.value[latestIndex].coverSide
        ) {
          const desiredCover = coversData.value.find((c) => {
            return c.coverSide === coverHistory.value[i].coverSide;
          });

          if (desiredCover) {
            const canvas = desiredCover.canvas;

            jsonLoadingRef.value = true;

            if (canvas)
              await canvas
                .loadFromJSON(
                  coverHistoryIndex.value <= 1
                    ? coverHistory.value[coverHistoryIndex.value].json
                    : coverHistory.value[i].json
                )
                .then(() => {
                  canvas.getObjects().map((obj) => {
                    const object = obj as CustomLineOptions;

                    if (object.lineType === "snap") {
                      canvas.remove(object);
                    }
                  });

                  new SnaplinesBeta(canvas as Canvas);
                  jsonLoadingRef.value = false;
                });
            canvas && canvas.requestRenderAll();
          }

          activeCoverRef.value = coverHistory.value[i].coverSide;

          break;
        } else if (
          coverHistory.value[coverHistoryIndex.value - 1].activeObject ===
            null &&
          latestHistoryObject === null
        ) {
          coverHistoryIndex.value -= 1;

          const desiredCover = coversData.value.find((c) => {
            return (
              c.coverSide ===
              coverHistory.value[coverHistoryIndex.value].coverSide
            );
          });

          if (desiredCover) {
            const canvas = desiredCover.canvas;
            jsonLoadingRef.value = true;

            // Wait for the canvas to load and render before continuing
            await canvas
              .loadFromJSON(coverHistory.value[coverHistoryIndex.value].json)
              .then(() => {
                canvas.getObjects().map((obj) => {
                  const object = obj as CustomLineOptions;

                  if (object.lineType === "snap") {
                    canvas.remove(object);
                  }
                });

                new SnaplinesBeta(canvas as Canvas);
                jsonLoadingRef.value = false;
              });
            canvas && canvas.requestRenderAll();
          }

          if (
            currentHistoryObject &&
            currentHistoryObject.lineType !== "perforation"
          )
            activeCoverRef.value =
              coverHistory.value[coverHistoryIndex.value].coverSide;

          break;
        }
      }
    } else {
      const historyToLoad = coverHistory.value[coverHistoryIndex.value];

      const desiredCover = coversData.value.find((p) => {
        return p.coverSide === historyToLoad.coverSide;
      });

      if (desiredCover) activeCoverRef.value = desiredCover.coverSide;

      jsonLoadingRef.value = true;

      if (desiredCover)
        await desiredCover.canvas.loadFromJSON(historyToLoad.json).then(() => {
          const canvas = desiredCover.canvas;
          if (canvas) {
            canvas.getObjects().map((obj) => {
              const object = obj as CustomLineOptions;

              if (object.lineType === "snap") {
                canvas.remove(object);
              }
            });

            new SnaplinesBeta(canvas as Canvas);

            canvas.requestRenderAll();
            jsonLoadingRef.value = false;
          }
        });
    }
  };

  const undoCoverHistory = async () => {
    if (coverHistory.value && coverHistoryIndex.value > 0) {
      coverHistoryIndex.value -= 1;

      const upperJson = coverHistory.value[coverHistoryIndex.value + 1]
        .json as jsonObject;

      const currentJson = coverHistory.value[coverHistoryIndex.value]
        .json as jsonObject;

      if (
        // upcomingJson.objects.length < 3 &&
        currentJson.objects.length < 3 &&
        upperJson.objects.length < 3
      ) {
        coverHistoryIndex.value += 1;
      } else {
        loadFromJson("undo");
      }
    }
  };

  //Redo - still notworking
  const redoCoverHistory = async () => {
    if (
      coverHistory.value &&
      coverHistoryIndex.value < coverHistory.value.length - 1
    ) {
      coverHistoryIndex.value += 1;

      loadFromJson("redo");
    }
  };

  return {
    initiateCover,
    undoCoverHistory,
    redoCoverHistory,
    coversData,
    activeObjectRef,
    coverLeftThumbnail,
    coverMiddleThumbnail,
    coverRightThumbnail,
    coverHistory,
    coverHistoryIndex,
    canvasDimensionsRef,
    activeCoverRef,
  };
};
