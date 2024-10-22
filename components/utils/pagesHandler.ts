import {
  FabricImage,
  Rect,
  type Canvas,
  type FabricObject,
  type TOriginX,
  type TOriginY,
} from "fabric";
import Page from "../artwork-upload-mode/helpers/Pages";

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

interface inlinePage {
  pageNumber: number;
  pageID: string;
  thumbnail: Ref<string>;
  canvas: Canvas;
  loading: Ref<boolean>;
}

interface inlinePageWithoutRefs {
  pageNumber: number;
  pageID: string;
  thumbnail: string;
  canvas: Canvas;
  loading: boolean;
}

interface currentCanvas {
  pageNumber: number;
  pageID: string;
  canvas: Canvas;
}

interface pagesHistory {
  pageNumber: number;
  activeObject: CustomLineOptions | null;
  actionType?: string;
  json: JSON;
}

interface jsonObject extends JSON {
  background: string;
  objects: object[];
  version: string;
}

interface canvasSize {
  width: number;
  height: number;
}

interface allThumbnailsRef {
  canvas: Canvas[];
  thumbnail: string[];
}

export function pageHandler(
  containerRef: HTMLElement | null,
  resizeElement: () => void
) {
  const actualSize = {
    width_mm: 120,
    height_mm: 120,
    dpi: 120,
  };

  const liveCanvases = ref<currentCanvas[]>([]);
  const apID = ref<string | null>(null);
  const allThumbnailsRef = ref<allThumbnailsRef | null>(null);
  const reactivePages = ref<inlinePage[]>([]);
  const canvasSize = ref<canvasSize | null>(null);
  const pgCounter = ref<number>(0);
  const pgActiveObj = ref<FabricObject | null>(null);
  const pagesHistory = ref<pagesHistory[]>([]);
  const historyIndex = ref<number>(-1);
  const JSONLoading = ref<boolean>(false);

  const PageMode = async () => {
    const dataString = localStorage.getItem("pagesInfo");
    const pagesData: { pageNumber: number; pageID: string; pageJSON: JSON }[] =
      JSON.parse(dataString!);

    if (pagesData && containerRef) {
      const list = containerRef.querySelectorAll(".containerCanvases");

      list &&
        list.forEach((child) => {
          containerRef.removeChild(child);
        });

      const width_px = (actualSize.width_mm / 25.4) * actualSize.dpi;
      const height_px = (actualSize.height_mm / 25.4) * actualSize.dpi;

      canvasSize.value = {
        width: width_px,
        height: height_px,
      };

      const pageInstances: Page[] = [];
      reactivePages.value = [];

      const canvases: Canvas[] = [];
      const thumbs: string[] = [];

      if (pageInstances) {
        for (let i = 1; i <= pagesData.length; i++) {
          pageInstances.push(
            new Page(
              actualSize,
              i,
              containerRef,
              pgActiveObj as Ref<FabricObject | null>,
              allThumbnailsRef as Ref<allThumbnailsRef>,
              pagesHistory as Ref<pagesHistory[]>,
              historyIndex,
              JSONLoading
            )
          );

          reactivePages.value.push({
            pageNumber: pageInstances[i - 1].pageNumber,
            pageID: pageInstances[i - 1].pageID,
            thumbnail: pageInstances[i - 1].canvas!.toDataURL(),
            canvas: pageInstances[i - 1].canvas!,
            loading: pageInstances[i - 1].loading.value,
          });

          canvases.push(reactivePages.value[i - 1].canvas as Canvas);

          thumbs.push(reactivePages.value[i - 1].thumbnail);
        }
      }

      allThumbnailsRef.value = {
        canvas: canvases,
        thumbnail: thumbs,
      };

      reactivePages.value.map(async (page, index) => {
        page.loading = true;
        JSONLoading.value = true;

        await page.canvas.loadFromJSON(pagesData[index].pageJSON).then(() => {
          page.canvas && page.canvas.requestRenderAll();
          page.loading = false;
          JSONLoading.value = false;
        });
      });

      liveCanvases.value = [reactivePages.value[0], reactivePages.value[1]];

      apID.value = reactivePages.value[1].pageID;

      pgCounter.value = reactivePages.value.length;

      setTimeout(() => {
        resizeElement();
      }, 0);
    } else {
      // CLEARS ALL THE PREVIOUS CHILD ELEMENTS
      if (
        reactivePages.value &&
        reactivePages.value.length > 0 &&
        containerRef
      ) {
        const list = containerRef.querySelectorAll(".containerCanvases");

        list &&
          list.forEach((child) => {
            containerRef.removeChild(child);
          });

        reactivePages.value = [];
      }

      pgCounter.value = 0;

      const width_px = (actualSize.width_mm / 25.4) * actualSize.dpi;
      const height_px = (actualSize.height_mm / 25.4) * actualSize.dpi;

      canvasSize.value = {
        width: width_px,
        height: height_px,
      };

      const pageInstancesToCreate = 4;
      const pageInstances = [];
      for (let i = 1; i <= pageInstancesToCreate; i++) {
        pageInstances.push(
          new Page(
            actualSize,
            i,
            containerRef,
            pgActiveObj as Ref<FabricObject | null>,
            allThumbnailsRef as Ref<allThumbnailsRef>,
            pagesHistory as Ref<pagesHistory[]>,
            historyIndex,
            JSONLoading
          )
        );
      }

      pageInstances.map((page, index) => {
        if (page) {
          if (page.canvas)
            reactivePages.value.push({
              pageNumber: index + 1,
              pageID: page.pageID,
              thumbnail: page.canvas.toDataURL(),
              canvas: page.canvas,
              loading: page.loading.value,
            });
        }
      });

      const allCanvasesList = reactivePages.value.map((page) => {
        return page.canvas;
      });

      const allThumbnailsList = reactivePages.value.map((page) => {
        return page.thumbnail;
      });

      allThumbnailsRef.value = {
        canvas: allCanvasesList,
        thumbnail: allThumbnailsList,
      };

      pgCounter.value = 4;

      liveCanvases.value = [reactivePages.value[0], reactivePages.value[1]];

      const canvas = pageInstances[0].canvas;
      const canvas2 = pageInstances[pageInstances.length - 1].canvas;
      if (canvas) {
        const zoom = canvas.getZoom();

        const CoverPage = new Rect({
          id: "firstPageCover",
          left: zoom,
          top: 0,
          width: canvas.width / zoom,
          height: canvas.height / zoom,
          fill: "darkgray",
          selectable: false,
          hasBorders: false,
          hasControls: false,
        });

        const CoverPageEnd = new Rect({
          id: "cover",
          width: canvas.width / zoom,
          height: canvas.height / zoom,
          fill: "darkgray",
          selectable: false,
          hasBorders: false,
          hasControls: false,
        });

        canvas.add(CoverPage);
        canvas2?.add(CoverPageEnd);
      }

      if (canvas) canvas.requestRenderAll();
      if (canvas2) canvas2.requestRenderAll();

      setTimeout(() => {
        resizeElement();
      }, 0);
      apID.value = pageInstances[1].pageID;
    }
  };

  const loadPage = (page: inlinePageWithoutRefs) => {
    apID.value = page.pageID;

    if (reactivePages.value && apID.value === page.pageID) {
      reactivePages.value.forEach(
        (c) => (c.canvas.wrapperEl.style.border = "2px solid black")
      );
      page.canvas.wrapperEl.style.border = "2px solid lightgreen";
    }

    if (reactivePages.value.length >= 2 && liveCanvases.value) {
      const currentPageIndex = reactivePages.value.findIndex((p) => {
        return p.pageID === page.pageID;
      });

      const nextPage =
        page.pageNumber % 2 === 0
          ? reactivePages.value[currentPageIndex - 1]
          : reactivePages.value[currentPageIndex + 1];
      const pagesToLoad = [page, nextPage];

      liveCanvases.value = pagesToLoad;

      pagesToLoad.forEach((page) => {
        page.canvas.getObjects().forEach((obj) => {
          obj.setCoords();
        });

        page.canvas.requestRenderAll();
      });

      if (liveCanvases.value[1].pageNumber !== reactivePages.value.length) {
        const canvas = liveCanvases.value[1].canvas;

        canvas &&
          canvas.getObjects().forEach((obj) => {
            if (
              (canvas && obj.id && obj.id === "cover") ||
              (canvas && obj.id && obj.id === "frame")
            ) {
              canvas.remove(obj);
              canvas.requestRenderAll();
            }
          });
      } else {
        // last page
      }

      if (liveCanvases.value[0].pageNumber === 1) {
        const cover = liveCanvases.value[0].canvas._objects.find((obj) => {
          return obj.id === "firstPageCover";
        });

        if (cover && liveCanvases.value[0].canvas._objects.includes(cover)) {
          // cover is present
        } else {
          const canvas = liveCanvases.value[1].canvas;
          if (canvas) {
            const zoom = canvas.getZoom();

            const CoverPage = new Rect({
              id: "firstPageCover",
              side: "left",
              left: zoom,
              top: 0,
              width: canvas.width / 2 / zoom,
              height: canvas.height / zoom,
              fill: "darkgray",
              selectable: false,
              hasBorders: false,
              hasControls: false,
            });
            canvas.add(CoverPage);

            canvas.requestRenderAll();
          }
        }
      }
    }
  };

  const createNewPage = async () => {
    pgCounter.value++;

    const pageInstance1 = new Page(
      actualSize,
      pgCounter.value,
      containerRef,
      pgActiveObj as Ref<FabricObject | null>,
      allThumbnailsRef as Ref<allThumbnailsRef>,
      pagesHistory as Ref<pagesHistory[]>,
      historyIndex,
      JSONLoading
    );

    pgCounter.value++;
    const pageInstance2 = new Page(
      actualSize,
      pgCounter.value,
      containerRef,
      pgActiveObj as Ref<FabricObject | null>,
      allThumbnailsRef as Ref<allThumbnailsRef>,
      pagesHistory as Ref<pagesHistory[]>,
      historyIndex,
      JSONLoading
    );

    if (pageInstance1.canvas && pageInstance2.canvas)
      reactivePages.value.push(
        {
          pageNumber: pageInstance1.pageNumber,
          pageID: pageInstance1.pageID,
          thumbnail: pageInstance1.thumbnail.value,
          canvas: pageInstance1.canvas,
          loading: pageInstance1.loading.value,
        },
        {
          pageNumber: pageInstance2.pageNumber,
          pageID: pageInstance2.pageID,
          thumbnail: pageInstance2.thumbnail.value,
          canvas: pageInstance2.canvas,
          loading: pageInstance2.loading.value,
        }
      );

    if (pageInstance1.canvas && pageInstance2.canvas)
      allThumbnailsRef.value &&
        allThumbnailsRef.value.canvas.push(
          pageInstance1.canvas,
          pageInstance2.canvas
        );

    allThumbnailsRef.value &&
      allThumbnailsRef.value.thumbnail.push(
        pageInstance1.thumbnail.value,
        pageInstance2.thumbnail.value
      );

    liveCanvases.value = [
      reactivePages.value[pageInstance1.pageNumber - 1],
      reactivePages.value[pageInstance2.pageNumber - 1],
    ];

    const prevRight =
      reactivePages.value[reactivePages.value.length - 1].pageNumber;

    if (
      prevRight &&
      prevRight !== 2 &&
      prevRight === reactivePages.value.length
    ) {
      const canvas = pageInstance2.canvas;
      if (canvas) {
        const zoom = canvas.getZoom();
        const CoverPage = new Rect({
          id: "cover",
          width: canvas.width / zoom,
          height: canvas.height / zoom,
          fill: "darkgray",
          selectable: false,
          hasBorders: false,
          hasControls: false,
        });

        canvas.add(CoverPage);
        canvas.sendObjectToBack(CoverPage);
        canvas.requestRenderAll();
      }

      apID.value = pageInstance1.pageID;
    }

    reactivePages.value.map((page) => {
      if (page.pageNumber !== prevRight) {
        if (page) {
          const objects = page.canvas.getObjects();

          objects.forEach((obj) => {
            if (page && obj.id && obj.id === "cover") {
              page.canvas.remove(obj);
              const canvas = page.canvas;
              const frame = new URL("@/assets/pagesFrame.png", import.meta.url)
                .href;

              if (frame)
                FabricImage.fromURL(frame).then((loadedImg) => {
                  if (canvas && loadedImg) {
                    loadedImg.set({
                      id: "frame",
                      selectable: false,
                      hasControls: false,
                    });

                    loadedImg.scaleToWidth(canvas.width / canvas.getZoom());
                    loadedImg.scaleToHeight(canvas.height / canvas.getZoom());
                    loadedImg.setCoords();

                    canvas.set({
                      overlayImage: loadedImg,
                    });

                    if (canvas && allThumbnailsRef.value) {
                      allThumbnailsRef.value.thumbnail[page.pageNumber - 1] =
                        canvas.toDataURL();
                    }

                    canvas.renderAll();
                  }
                });
              page.canvas.requestRenderAll();
            }
          });
        }
      }
    });

    setTimeout(() => {
      resizeElement();
    }, 0);
  };

  const loadFromJson = async (action: string) => {
    const latestIndex = historyIndex.value + 1;
    const currentHistoryObject =
      pagesHistory.value[historyIndex.value] &&
      pagesHistory.value[historyIndex.value].activeObject;

    const latestHistoryObject =
      pagesHistory.value[historyIndex.value + 1] &&
      pagesHistory.value[historyIndex.value + 1].activeObject;

    if (action === "undo") {
      for (let i = historyIndex.value; i >= 0; i--) {
        if (
          pagesHistory.value[i].pageNumber ===
          pagesHistory.value[latestIndex].pageNumber
        ) {
          const desiredPage = reactivePages.value.find((page) => {
            return page.pageNumber === pagesHistory.value[i].pageNumber;
          });

          if (desiredPage) {
            const canvas = desiredPage.canvas;

            JSONLoading.value = true;

            // Wait for the canvas to load and render before continuing
            if (canvas)
              await canvas
                .loadFromJSON(
                  historyIndex.value <= 1
                    ? pagesHistory.value[historyIndex.value].json
                    : pagesHistory.value[i].json
                )
                .then(() => {
                  canvas && canvas.requestRenderAll();

                  JSONLoading.value = false;
                });

            if (
              currentHistoryObject?.lineType !== "perforation" &&
              latestHistoryObject?.lineType !== "perforation"
            )
              loadPage(desiredPage as inlinePageWithoutRefs);
          }

          break; // Exit the outer loop after the first match is processed
        } else if (
          pagesHistory.value[historyIndex.value - 1].activeObject === null &&
          currentHistoryObject &&
          currentHistoryObject.lineType !== "perforation" &&
          historyIndex.value <= 2 &&
          (latestHistoryObject === null ||
            (latestHistoryObject &&
              latestHistoryObject.lineType !== "perforation"))
        ) {
          historyIndex.value -= 1;

          const desiredPage = reactivePages.value.find((page) => {
            return (
              page.pageNumber ===
              pagesHistory.value[historyIndex.value].pageNumber
            );
          });

          if (desiredPage) {
            const canvas = desiredPage.canvas;

            JSONLoading.value = true;

            // Wait for the canvas to load and render before continuing
            await canvas
              .loadFromJSON(pagesHistory.value[historyIndex.value].json)
              .then(() => {
                canvas && canvas.requestRenderAll();

                JSONLoading.value = false;
              });

            if (
              currentHistoryObject?.lineType !== "perforation" &&
              latestHistoryObject?.lineType !== "perforation"
            )
              loadPage(desiredPage as inlinePageWithoutRefs);
          }

          break;
        }
      }
    } else {
      const historyToLoad = pagesHistory.value[historyIndex.value];

      const desiredPage = reactivePages.value.find((p) => {
        return p.pageNumber === historyToLoad.pageNumber;
      });

      if (
        currentHistoryObject?.lineType !== "perforation" &&
        latestHistoryObject?.lineType !== "perforation"
      )
        loadPage(desiredPage as inlinePageWithoutRefs);

      JSONLoading.value = true;

      if (desiredPage)
        await desiredPage.canvas.loadFromJSON(historyToLoad.json).then(() => {
          const canvas = desiredPage.canvas;
          if (canvas) {
            canvas.requestRenderAll();
            JSONLoading.value = false;
          }
        });
    }
  };

  const undoPagesHistory = async () => {
    if (JSONLoading.value) return;

    if (pagesHistory.value && historyIndex.value > 0) {
      historyIndex.value -= 1;

      const currentHistoryObject =
        pagesHistory.value[historyIndex.value] &&
        pagesHistory.value[historyIndex.value].activeObject;
      const latestHistoryObject =
        pagesHistory.value[historyIndex.value + 1] &&
        pagesHistory.value[historyIndex.value + 1].activeObject;
      const latestHistoryActionType =
        pagesHistory.value[historyIndex.value + 1] &&
        pagesHistory.value[historyIndex.value + 1].actionType;

      const nextUndoObject =
        pagesHistory.value[historyIndex.value - 1] &&
        pagesHistory.value[historyIndex.value - 1].activeObject;

      const twoUndosObject =
        pagesHistory.value[historyIndex.value - 2] &&
        pagesHistory.value[historyIndex.value - 2].activeObject;

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
          for (let i = historyIndex.value - 1; i >= 0; i--) {
            if (
              pagesHistory.value[i].pageNumber !==
              pagesHistory.value[historyIndex.value].pageNumber
            ) {
              const desiredPage = reactivePages.value.find((page) => {
                return page.pageNumber === pagesHistory.value[i].pageNumber;
              });

              if (desiredPage) {
                const canvas = desiredPage.canvas;

                JSONLoading.value = true;

                if (canvas)
                  await canvas.loadFromJSON(pagesHistory.value[i].json);
                canvas && canvas.requestRenderAll();
                JSONLoading.value = false;
              }

              break;
            }
          }

          historyIndex.value -= 1;
        } else if (
          currentHistoryObject.lineType !== "perforation" &&
          nextUndoObject &&
          nextUndoObject.lineType === "perforation"
        ) {
          // IF COND 1 IS true, PHASE 2: IF PERFORATION LINE IS PRESENT 2 INDEXES BELOW LATEST OR NOT

          // IF COND 1 PHASE 2 IS true, PHASE 3: IF PERFORATION LINE IS PRESENT 3 INDEXES BELOW LATEST OR NOT
          if (twoUndosObject && twoUndosObject.lineType === "perforation") {
            const desiredPage = reactivePages.value.find((page) => {
              return (
                page.pageNumber ===
                pagesHistory.value[historyIndex.value - 2].pageNumber
              );
            });

            if (desiredPage) {
              const canvas = desiredPage.canvas;

              JSONLoading.value = true;

              // Wait for the canvas to load and render before continuing
              await canvas.loadFromJSON(
                pagesHistory.value[historyIndex.value - 2].json
              );
              canvas && canvas.requestRenderAll();
              JSONLoading.value = false;
              historyIndex.value -= 1;
            }
          } else {
            // IF OBJECT IS NULL 4 INDEXES BELOW LATEST THEN RUN LOOPS ELSE DO NOTHING
            if (
              pagesHistory.value[historyIndex.value - 3].activeObject ===
                null &&
              latestHistoryObject &&
              latestHistoryObject.lineType === "perforation"
            ) {
              const indexToStartFrom = pagesHistory.value.indexOf(
                pagesHistory.value[historyIndex.value]
              );

              for (let i = indexToStartFrom - 1; i >= 0; i--) {
                if (
                  pagesHistory.value[i].pageNumber ===
                  pagesHistory.value[indexToStartFrom].pageNumber
                ) {
                  const desiredPage = reactivePages.value.find((page) => {
                    return page.pageNumber === pagesHistory.value[i].pageNumber;
                  });

                  if (desiredPage) {
                    const canvas = desiredPage.canvas;

                    JSONLoading.value = true;

                    // Wait for the canvas to load and render before continuing
                    await canvas.loadFromJSON(pagesHistory.value[i].json);
                    canvas && canvas.requestRenderAll();
                    JSONLoading.value = false;
                  }

                  // Now that the canvas loading is done, we can safely start the inner loop
                  for (let j = indexToStartFrom - 1; j >= 0; j--) {
                    if (
                      pagesHistory.value[j].pageNumber !==
                      pagesHistory.value[indexToStartFrom].pageNumber
                    ) {
                      const desiredPage = reactivePages.value.find((page) => {
                        return (
                          page.pageNumber === pagesHistory.value[j].pageNumber
                        );
                      });

                      if (desiredPage) {
                        const canvas = desiredPage.canvas;

                        JSONLoading.value = true;

                        // Wait for the canvas to load and render before breaking
                        await canvas.loadFromJSON(pagesHistory.value[j].json);
                        canvas && canvas.requestRenderAll();
                        JSONLoading.value = false;
                      }

                      break; // Exit the inner loop after loading from the JSON
                    }
                  }

                  break; // Exit the outer loop after the first match is processed
                }
              }
              historyIndex.value -= 1;
            }
          }
          // CONDITION 1 PHASE 3 ENDS
        } else {
          if (
            pagesHistory.value[historyIndex.value + 1].actionType === "modified"
          ) {
            for (let i = historyIndex.value; i >= 0; i--) {
              if (
                pagesHistory.value[i].pageNumber ===
                pagesHistory.value[historyIndex.value + 1].pageNumber
              ) {
                const desiredPage = reactivePages.value.find((page) => {
                  return page.pageNumber === pagesHistory.value[i].pageNumber;
                });

                if (desiredPage) {
                  const canvas = desiredPage.canvas;

                  JSONLoading.value = true;

                  // Wait for the canvas to load and render before continuing
                  if (canvas)
                    await canvas.loadFromJSON(pagesHistory.value[i].json);
                  canvas && canvas.requestRenderAll();
                  JSONLoading.value = false;
                }

                break; // Exit the outer loop after the first match is processed
              }
            }

            historyIndex.value -= 1;
          } else {
            const indexToStartFrom = pagesHistory.value.indexOf(
              pagesHistory.value[historyIndex.value]
            );

            if (
              latestHistoryObject &&
              latestHistoryObject.lineType === "perforation"
            ) {
              for (let i = indexToStartFrom - 1; i >= 0; i--) {
                if (
                  pagesHistory.value[i].pageNumber ===
                  pagesHistory.value[indexToStartFrom].pageNumber
                ) {
                  const desiredPage = reactivePages.value.find((page) => {
                    return page.pageNumber === pagesHistory.value[i].pageNumber;
                  });

                  if (desiredPage) {
                    const canvas = desiredPage.canvas;

                    JSONLoading.value = true;

                    // Wait for the canvas to load and render before continuing
                    if (canvas)
                      await canvas.loadFromJSON(pagesHistory.value[i].json);
                    canvas && canvas.requestRenderAll();
                    JSONLoading.value = false;
                  }

                  // Now that the canvas loading is done, we can safely start the inner loop
                  for (let j = indexToStartFrom - 1; j >= 0; j--) {
                    if (
                      pagesHistory.value[j].pageNumber !==
                      pagesHistory.value[indexToStartFrom].pageNumber
                    ) {
                      const desiredPage = reactivePages.value.find((page) => {
                        return (
                          page.pageNumber === pagesHistory.value[j].pageNumber
                        );
                      });

                      if (desiredPage) {
                        const canvas = desiredPage.canvas;

                        JSONLoading.value = true;

                        // Wait for the canvas to load and render before breaking
                        await canvas.loadFromJSON(pagesHistory.value[j].json);
                        canvas && canvas.requestRenderAll();
                        JSONLoading.value = false;
                      }

                      break; // Exit the inner loop after loading from the JSON
                    }
                  }

                  break; // Exit the outer loop after the first match is processed
                }
              }
              historyIndex.value -= 1;
            }
          }
        }
        // CONDITION 1 PHASE 2 ENDS
      } else if (!pagesHistory.value[historyIndex.value].activeObject) {
        if (
          pagesHistory.value[historyIndex.value - 1] &&
          pagesHistory.value[historyIndex.value - 1].activeObject !== null &&
          nextUndoObject &&
          nextUndoObject.lineType === "perforation"
        ) {
          if (
            !pagesHistory.value[historyIndex.value - 2].activeObject ||
            (twoUndosObject && twoUndosObject.lineType !== "perforation")
          ) {
            const desiredPage = reactivePages.value.find((page) => {
              return (
                page.pageNumber ===
                pagesHistory.value[historyIndex.value].pageNumber
              );
            });

            if (desiredPage) {
              const canvas = desiredPage.canvas;

              JSONLoading.value = true;

              // Wait for the canvas to load and render before continuing
              await canvas.loadFromJSON(
                pagesHistory.value[historyIndex.value].json
              );
              canvas && canvas.requestRenderAll();
              JSONLoading.value = false;
              historyIndex.value -= 1;
              historyIndex.value -= 1;
            }
          }
        }
      }

      const upperJson = pagesHistory.value[historyIndex.value + 1]
        .json as jsonObject;

      const currentJson = pagesHistory.value[historyIndex.value]
        .json as jsonObject;

      if (currentJson.objects.length < 7 && upperJson.objects.length < 7) {
        historyIndex.value += 1;
      } else {
        await loadFromJson("undo");
      }
    }
  };

  //Redo - still notworking
  const redoPagesHistory = async () => {
    if (JSONLoading.value) return;
    if (
      pagesHistory.value &&
      historyIndex.value < pagesHistory.value.length - 1
    ) {
      historyIndex.value += 1;

      await loadFromJson("redo");

      const currentHistoryObject =
        pagesHistory.value[historyIndex.value] &&
        pagesHistory.value[historyIndex.value].activeObject;

      const twoRedosObject =
        pagesHistory.value[historyIndex.value + 2] &&
        pagesHistory.value[historyIndex.value + 2].activeObject;

      if (
        currentHistoryObject &&
        currentHistoryObject.lineType === "perforation"
      ) {
        if (
          !pagesHistory.value[historyIndex.value + 1].activeObject &&
          twoRedosObject &&
          twoRedosObject.lineType === "perforation"
        ) {
          historyIndex.value += 2;

          const desiredPage = reactivePages.value.find((page) => {
            return (
              page.pageNumber ===
              pagesHistory.value[historyIndex.value].pageNumber
            );
          });

          if (desiredPage) {
            const canvas = desiredPage.canvas;

            JSONLoading.value = true;

            // Wait for the canvas to load and render before breaking
            await canvas.loadFromJSON(
              pagesHistory.value[historyIndex.value].json
            );
            canvas && canvas.requestRenderAll();

            JSONLoading.value = false;
          }
        } else {
          historyIndex.value += 1;

          const desiredPage = reactivePages.value.find((page) => {
            return (
              page.pageNumber ===
              pagesHistory.value[historyIndex.value].pageNumber
            );
          });

          if (desiredPage) {
            const canvas = desiredPage.canvas;
            JSONLoading.value = true;

            // Wait for the canvas to load and render before breaking
            await canvas.loadFromJSON(
              pagesHistory.value[historyIndex.value].json
            );
            canvas && canvas.requestRenderAll();
            JSONLoading.value = false;
          }
        }
      }
    }
  };

  return {
    PageMode,
    loadPage,
    createNewPage,
    undoPagesHistory,
    redoPagesHistory,
    liveCanvases,
    apID,
    allThumbnailsRef,
    reactivePages,
    canvasSize,
    pgCounter,
    pgActiveObj,
    pagesHistory,
    historyIndex,
    JSONLoading,
  };
}
