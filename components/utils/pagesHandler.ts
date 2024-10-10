import {
  FabricImage,
  Rect,
  type Canvas,
  type FabricObject,
  type TOriginX,
  type TOriginY,
} from "fabric";
import Page from "../artwork-upload-mode/helpers/Pages";

// const test = `{
//     "version": "6.0.2",
//     "objects": [
//         {
//             "type": "Line",
//             "version": "6.0.2",
//             "originX": "left",
//             "originY": "top",
//             "left": 354.0807,
//             "top": -0.25,
//             "width": 0,
//             "height": 708.6614,
//             "fill": "rgb(0,0,0)",
//             "stroke": "red",
//             "strokeWidth": 0.5,
//             "strokeDashArray": null,
//             "strokeLineCap": "butt",
//             "strokeDashOffset": 0,
//             "strokeLineJoin": "miter",
//             "strokeUniform": false,
//             "strokeMiterLimit": 4,
//             "scaleX": 1,
//             "scaleY": 1,
//             "angle": 0,
//             "flipX": false,
//             "flipY": false,
//             "opacity": 1,
//             "shadow": null,
//             "visible": false,
//             "backgroundColor": "",
//             "fillRule": "nonzero",
//             "paintFirst": "fill",
//             "globalCompositeOperation": "source-over",
//             "skewX": 0,
//             "skewY": 0,
//             "x1": 0,
//             "x2": 0,
//             "y1": -354.33070866141736,
//             "y2": 354.33070866141736
//         },
//         {
//             "type": "Line",
//             "version": "6.0.2",
//             "originX": "left",
//             "originY": "top",
//             "left": -0.25,
//             "top": 354.0807,
//             "width": 708.6614,
//             "height": 0,
//             "fill": "rgb(0,0,0)",
//             "stroke": "red",
//             "strokeWidth": 0.5,
//             "strokeDashArray": null,
//             "strokeLineCap": "butt",
//             "strokeDashOffset": 0,
//             "strokeLineJoin": "miter",
//             "strokeUniform": false,
//             "strokeMiterLimit": 4,
//             "scaleX": 1,
//             "scaleY": 1,
//             "angle": 0,
//             "flipX": false,
//             "flipY": false,
//             "opacity": 1,
//             "shadow": null,
//             "visible": false,
//             "backgroundColor": "",
//             "fillRule": "nonzero",
//             "paintFirst": "fill",
//             "globalCompositeOperation": "source-over",
//             "skewX": 0,
//             "skewY": 0,
//             "x1": -354.33070866141736,
//             "x2": 354.33070866141736,
//             "y1": 0,
//             "y2": 0
//         }
//     ],
//     "background": "white"
// }`;

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
    width_mm: 150,
    height_mm: 150,
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
    console.log("local data", pagesData);

    if (pagesData && containerRef) {
      const list = containerRef.querySelectorAll(".containerCanvases");

      list &&
        list.forEach((child) => {
          containerRef?.removeChild(child);
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

      for (let i = 1; i <= pagesData.length; i++) {
        pageInstances.push(
          new Page(
            actualSize,
            i,
            containerRef,
            pgActiveObj.value as FabricObject | null,
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

      allThumbnailsRef.value = {
        canvas: canvases,
        thumbnail: thumbs,
      };

      reactivePages.value.map(async (page, index) => {
        page.loading = true;
        JSONLoading.value = true;

        await page?.canvas.loadFromJSON(pagesData[index].pageJSON).then(() => {
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
      if (reactivePages.value && reactivePages.value.length > 0) {
        const list = containerRef?.querySelectorAll(".containerCanvases");

        list &&
          list.forEach((child) => {
            containerRef?.removeChild(child);
          });
      }

      pgCounter.value = 0;

      const width_px = (actualSize.width_mm / 25.4) * actualSize.dpi;
      const height_px = (actualSize.height_mm / 25.4) * actualSize.dpi;

      canvasSize.value = {
        width: width_px,
        height: height_px,
      };

      // pagesHistory.value.push({
      //   pageNumber: 2,
      //   activeObject: null,
      //   json: JSON.parse(test),
      // });
      // historyIndex.value = 0;

      pgCounter.value++;
      const pageInstance1 = new Page(
        actualSize,
        pgCounter.value,
        containerRef,
        pgActiveObj.value as FabricObject,
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
        pgActiveObj.value as FabricObject,
        allThumbnailsRef as Ref<allThumbnailsRef>,
        pagesHistory as Ref<pagesHistory[]>,
        historyIndex,
        JSONLoading
      );

      reactivePages.value = [
        {
          pageNumber: 1,
          pageID: pageInstance1.pageID,
          thumbnail: pageInstance1.thumbnail.value,
          canvas: pageInstance1.canvas!,
          loading: pageInstance1.loading.value,
        },
        {
          pageNumber: 2,
          pageID: pageInstance2.pageID,
          thumbnail: pageInstance2.thumbnail.value,
          canvas: pageInstance2.canvas!,
          loading: pageInstance2.loading.value,
        },
      ];

      allThumbnailsRef.value = {
        canvas: [pageInstance1.canvas!, pageInstance2.canvas!],
        thumbnail: [
          pageInstance1.thumbnail.value,
          pageInstance2.thumbnail.value,
        ],
      };

      liveCanvases.value = [reactivePages.value[0], reactivePages.value[1]];

      if (pageInstance1.pageNumber === 1) {
        const canvas = pageInstance1.canvas;
        if (canvas) {
          const zoom = canvas.getZoom();

          const CoverPage = new Rect({
            id: "firstPageCover",
            side: "left",
            left: zoom,
            top: 0,
            width: canvas.width / zoom,
            height: canvas.height / zoom,
            fill: "darkgray",
            selectable: false,
            hasBorders: false,
            hasControls: false,
          });

          canvas.add(CoverPage);
        }

        canvas!.requestRenderAll();
        setTimeout(() => {
          resizeElement();
        }, 0);
      }
      apID.value = pageInstance2.pageID;
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
        console.log("LAST PAGE");
      }

      if (liveCanvases.value[0].pageNumber === 1) {
        const cover = liveCanvases.value[0].canvas._objects.find((obj) => {
          return obj.id === "firstPageCover";
        });

        if (cover && liveCanvases.value[0].canvas._objects.includes(cover)) {
          console.log("cover is present");
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
    // pagesHistory.value.push({
    //   pageNumber: pgCounter.value,
    //   json: JSON.parse(test),
    // });
    // historyIndex.value++;

    const pageInstance1 = new Page(
      actualSize,
      pgCounter.value,
      containerRef,
      pgActiveObj.value as FabricObject,
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
      pgActiveObj.value as FabricObject,
      allThumbnailsRef as Ref<allThumbnailsRef>,
      pagesHistory as Ref<pagesHistory[]>,
      historyIndex,
      JSONLoading
    );

    reactivePages.value.push(
      {
        pageNumber: pageInstance1.pageNumber,
        pageID: pageInstance1.pageID,
        thumbnail: pageInstance1.thumbnail.value,
        canvas: pageInstance1.canvas!,
        loading: pageInstance1.loading.value,
      },
      {
        pageNumber: pageInstance2.pageNumber,
        pageID: pageInstance2.pageID,
        thumbnail: pageInstance2.thumbnail.value,
        canvas: pageInstance2.canvas!,
        loading: pageInstance2.loading.value,
      }
    );

    allThumbnailsRef.value &&
      allThumbnailsRef.value.canvas.push(
        pageInstance1.canvas!,
        pageInstance2.canvas!
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
      const zoom = canvas!.getZoom();
      const CoverPage = new Rect({
        id: "cover",
        width: canvas!.width / zoom,
        height: canvas!.height / zoom,
        fill: "darkgray",
        selectable: false,
        hasBorders: false,
        hasControls: false,
      });

      canvas!.add(CoverPage);
      canvas!.sendObjectToBack(CoverPage);
      canvas!.requestRenderAll();

      apID.value = pageInstance2.pageID;
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
    console.log("CURRENT ACTION INDEX", historyIndex.value);

    const latestIndex = historyIndex.value + 1;

    if (action === "undo") {
      for (let i = historyIndex.value; i >= 0; i--) {
        if (
          pagesHistory.value[i].pageNumber ===
          pagesHistory.value[latestIndex].pageNumber
        ) {
          const desiredPage = reactivePages.value.find((page) => {
            return page.pageNumber === pagesHistory.value[i].pageNumber;
          });

          console.log("DESIRED PAGE DURING JSON LOADING", desiredPage);

          const canvas = desiredPage?.canvas;

          console.log(
            "index of History that we are loading",
            pagesHistory.value.indexOf(pagesHistory.value[i])
          );

          JSONLoading.value = true;

          // Wait for the canvas to load and render before continuing
          if (canvas)
            await canvas.loadFromJSON(
              historyIndex.value <= 1
                ? pagesHistory.value[historyIndex.value].json
                : pagesHistory.value[i].json
            );
          canvas && canvas.requestRenderAll();
          JSONLoading.value = false;

          loadPage(desiredPage as inlinePageWithoutRefs);

          break; // Exit the outer loop after the first match is processed
        }
      }
    } else {
      const historyToLoad = pagesHistory.value[historyIndex.value];

      // const hindex = pagesHistory.value.findIndex((f) => {
      //   return f === pagesHistory.value[historyIndex.value];
      // });

      // console.log("pagesHistory to load index", hindex);

      const desiredPage = reactivePages.value.find((p) => {
        return p.pageNumber === historyToLoad.pageNumber;
      });

      // console.log("DESIRED PAGE", desiredPage);

      loadPage(desiredPage as inlinePageWithoutRefs);

      JSONLoading.value = true;

      // console.log("page loading value brfore json loading", desiredPage?.loading);

      await desiredPage?.canvas.loadFromJSON(historyToLoad.json).then(() => {
        desiredPage.canvas && desiredPage.canvas.requestRenderAll();
        JSONLoading.value = false;
        // console.log("page loading value after json loading", desiredPage.loading);
      });
    }
  };

  const undoPagesHistory = async () => {
    if (pagesHistory.value && historyIndex.value > 0) {
      historyIndex.value--;

      console.log("HISTORY", pagesHistory.value, historyIndex.value);

      // CONDITION 1: IF PERFORATION LINE IS PRESENT AFTER UNDO OR THE OBJECT IS NULL
      if (
        pagesHistory.value[historyIndex.value].activeObject?.lineType ===
        "perforation"
      ) {
        // IF COND 1 IS true AND PERFORATION LINE IS PRESENT IN LATEST INDEX AND THAT LINE IS MODIFIED
        if (
          pagesHistory.value[historyIndex.value + 1].activeObject?.lineType ===
            "perforation" &&
          pagesHistory.value[historyIndex.value + 1]?.actionType === "modified"
        ) {
          console.log(
            "PERFORATION LINE IS PRESENT IN LATEST INDEX AND THAT LINE IS MODIFIED"
          );

          for (let i = historyIndex.value - 1; i >= 0; i--) {
            if (
              pagesHistory.value[i].pageNumber !==
              pagesHistory.value[historyIndex.value].pageNumber
            ) {
              const desiredPage = reactivePages.value.find((page) => {
                return page.pageNumber === pagesHistory.value[i].pageNumber;
              });

              const canvas = desiredPage?.canvas;

              JSONLoading.value = true;

              if (canvas) await canvas.loadFromJSON(pagesHistory.value[i].json);
              canvas && canvas.requestRenderAll();
              JSONLoading.value = false;

              break;
            }
          }

          historyIndex.value--;
        } else if (
          pagesHistory.value[historyIndex.value - 1].activeObject?.lineType ===
          "perforation"
        ) {
          // IF COND 1 IS true, PHASE 2: IF PERFORATION LINE IS PRESENT 2 INDEXES BELOW LATEST OR NOT

          console.log(
            "line is also present in next undo",
            pagesHistory.value[historyIndex.value]
          );

          // IF COND 1 PHASE 2 IS true, PHASE 3: IF PERFORATION LINE IS PRESENT 3 INDEXES BELOW LATEST OR NOT
          if (
            pagesHistory.value[historyIndex.value - 2].activeObject
              ?.lineType === "perforation"
          ) {
            console.log(
              "another line is also present in double next undo i.e mirror line modification occured",
              historyIndex.value - 2
            );

            const desiredPage = reactivePages.value.find((page) => {
              return (
                page.pageNumber ===
                pagesHistory.value[historyIndex.value - 2].pageNumber
              );
            });

            const canvas = desiredPage?.canvas;

            JSONLoading.value = true;

            // Wait for the canvas to load and render before continuing
            if (canvas)
              await canvas.loadFromJSON(
                pagesHistory.value[historyIndex.value - 2].json
              );
            canvas && canvas.requestRenderAll();
            JSONLoading.value = false;
            historyIndex.value--;
          } else {
            console.log(
              "another line is NOTTT present 3 indexes below LATEST index",
              pagesHistory.value[historyIndex.value - 2]
            );

            // IF OBJECT IS NULL 4 INDEXES BELOW LATEST THEN RUN LOOPS ELSE DO NOTHING
            if (
              pagesHistory.value[historyIndex.value - 3].activeObject ===
                null &&
              pagesHistory.value[historyIndex.value + 1].activeObject
                ?.lineType === "perforation"
            ) {
              console.log(
                "OBJECT IS NULL 4 INDEXES BELOW LATEST so RUNNING LOOP"
              );

              const indexToStartFrom = pagesHistory.value.indexOf(
                pagesHistory.value[historyIndex.value]
              );

              for (let i = indexToStartFrom - 1; i >= 0; i--) {
                if (
                  pagesHistory.value[i].pageNumber ===
                  pagesHistory.value[indexToStartFrom].pageNumber
                ) {
                  console.log("desired history chunk", pagesHistory.value[i]);
                  console.log(
                    "index of desired chunk",
                    pagesHistory.value.indexOf(pagesHistory.value[i])
                  );

                  const desiredPage = reactivePages.value.find((page) => {
                    return page.pageNumber === pagesHistory.value[i].pageNumber;
                  });

                  const canvas = desiredPage?.canvas;

                  JSONLoading.value = true;

                  // Wait for the canvas to load and render before continuing
                  if (canvas)
                    await canvas.loadFromJSON(pagesHistory.value[i].json);
                  canvas && canvas.requestRenderAll();
                  JSONLoading.value = false;

                  // Now that the canvas loading is done, we can safely start the inner loop
                  for (let j = indexToStartFrom - 1; j >= 0; j--) {
                    console.log(
                      "j loop condition ",
                      pagesHistory.value[j].pageNumber !==
                        pagesHistory.value[indexToStartFrom].pageNumber,
                      i - 1
                    );

                    if (
                      pagesHistory.value[j].pageNumber !==
                      pagesHistory.value[indexToStartFrom].pageNumber
                    ) {
                      console.log(
                        "page number not matched j loop",
                        pagesHistory.value[j]
                      );
                      console.log(
                        "history index in j loop",
                        pagesHistory.value.indexOf(pagesHistory.value[j])
                      );

                      const desiredPage = reactivePages.value.find((page) => {
                        return (
                          page.pageNumber === pagesHistory.value[j].pageNumber
                        );
                      });

                      const canvas = desiredPage?.canvas;

                      JSONLoading.value = true;

                      // Wait for the canvas to load and render before breaking
                      if (canvas)
                        await canvas.loadFromJSON(pagesHistory.value[j].json);
                      canvas && canvas.requestRenderAll();
                      JSONLoading.value = false;

                      break; // Exit the inner loop after loading from the JSON
                    }
                  }

                  break; // Exit the outer loop after the first match is processed
                }
              }
              historyIndex.value--;
            }
          }
          // CONDITION 1 PHASE 3 ENDS
        } else {
          console.log("LINE IS NOT PRESENT 2 INDEXES BELOW LATEST");

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

                const canvas = desiredPage?.canvas;

                JSONLoading.value = true;

                // Wait for the canvas to load and render before continuing
                if (canvas)
                  await canvas.loadFromJSON(pagesHistory.value[i].json);
                canvas && canvas.requestRenderAll();
                JSONLoading.value = false;

                break; // Exit the outer loop after the first match is processed
              }
            }

            historyIndex.value--;
          } else {
            const indexToStartFrom = pagesHistory.value.indexOf(
              pagesHistory.value[historyIndex.value]
            );

            if (
              pagesHistory.value[historyIndex.value + 1].activeObject
                ?.lineType === "perforation"
            ) {
              console.log("object of latest index is perforation line ");

              for (let i = indexToStartFrom - 1; i >= 0; i--) {
                if (
                  pagesHistory.value[i].pageNumber ===
                  pagesHistory.value[indexToStartFrom].pageNumber
                ) {
                  console.log("desired history chunk", pagesHistory.value[i]);
                  console.log(
                    "index of desired chunk",
                    pagesHistory.value.indexOf(pagesHistory.value[i])
                  );

                  const desiredPage = reactivePages.value.find((page) => {
                    return page.pageNumber === pagesHistory.value[i].pageNumber;
                  });

                  const canvas = desiredPage?.canvas;

                  JSONLoading.value = true;

                  // Wait for the canvas to load and render before continuing
                  if (canvas)
                    await canvas.loadFromJSON(pagesHistory.value[i].json);
                  canvas && canvas.requestRenderAll();
                  JSONLoading.value = false;

                  // Now that the canvas loading is done, we can safely start the inner loop
                  for (let j = indexToStartFrom - 1; j >= 0; j--) {
                    console.log(
                      "j loop condition ",
                      pagesHistory.value[j].pageNumber !==
                        pagesHistory.value[indexToStartFrom].pageNumber,
                      i - 1
                    );

                    if (
                      pagesHistory.value[j].pageNumber !==
                      pagesHistory.value[indexToStartFrom].pageNumber
                    ) {
                      console.log(
                        "side not matched j loop",
                        pagesHistory.value[j]
                      );
                      console.log(
                        "history index in j loop",
                        pagesHistory.value.indexOf(pagesHistory.value[j])
                      );

                      const desiredPage = reactivePages.value.find((page) => {
                        return (
                          page.pageNumber === pagesHistory.value[j].pageNumber
                        );
                      });

                      const canvas = desiredPage?.canvas;

                      JSONLoading.value = true;

                      // Wait for the canvas to load and render before breaking
                      await canvas?.loadFromJSON(pagesHistory.value[j].json);
                      canvas && canvas.requestRenderAll();
                      JSONLoading.value = false;

                      break; // Exit the inner loop after loading from the JSON
                    }
                  }

                  break; // Exit the outer loop after the first match is processed
                }
              }
              historyIndex.value--;
            }
          }
        }
        // CONDITION 1 PHASE 2 ENDS
      } else if (!pagesHistory.value[historyIndex.value].activeObject) {
        console.log(
          "active object is null i.e first ever object in that canvas",
          pagesHistory.value[historyIndex.value]
        );

        if (
          pagesHistory.value[historyIndex.value - 1] &&
          pagesHistory.value[historyIndex.value - 1].activeObject !== null &&
          pagesHistory.value[historyIndex.value - 1].activeObject?.lineType ===
            "perforation"
        ) {
          console.log("line present 1 index under", historyIndex.value - 1);

          if (
            !pagesHistory.value[historyIndex.value - 2].activeObject ||
            pagesHistory.value[historyIndex.value - 2].activeObject
              ?.lineType !== "perforation"
          ) {
            console.log(
              "object is null or no line present 2 indexes under",
              historyIndex.value - 2
            );

            const desiredPage = reactivePages.value.find((page) => {
              return (
                page.pageNumber ===
                pagesHistory.value[historyIndex.value].pageNumber
              );
            });

            const canvas = desiredPage?.canvas;

            JSONLoading.value = true;

            // Wait for the canvas to load and render before continuing
            await canvas?.loadFromJSON(
              pagesHistory.value[historyIndex.value].json
            );
            canvas && canvas.requestRenderAll();
            JSONLoading.value = false;
            historyIndex.value--;
            historyIndex.value--;
          }
        }
      }

      const upperJson = pagesHistory.value[historyIndex.value + 1]
        .json as jsonObject;

      const currentJson = pagesHistory.value[historyIndex.value]
        .json as jsonObject;

      if (currentJson.objects.length < 3 && upperJson.objects.length < 3) {
        historyIndex.value++;
        console.log("length less than 2", historyIndex.value);
      } else {
        loadFromJson("undo");
      }
    }
  };

  //Redo - still notworking
  const redoPagesHistory = async () => {
    if (
      pagesHistory.value &&
      historyIndex.value < pagesHistory.value.length - 1
    ) {
      console.log("HISTORY", pagesHistory.value);

      historyIndex.value++;

      await loadFromJson("redo");

      if (
        pagesHistory.value[historyIndex.value].activeObject?.lineType ===
        "perforation"
      ) {
        if (
          !pagesHistory.value[historyIndex.value + 1].activeObject &&
          pagesHistory.value[historyIndex.value + 2].activeObject?.lineType ===
            "perforation"
        ) {
          historyIndex.value++;
          historyIndex.value++;

          JSONLoading.value = true;

          console.log(
            "HISTORY after both lines were added at empty canvases",
            pagesHistory.value,
            historyIndex.value
          );

          const desiredPage = reactivePages.value.find((page) => {
            return (
              page.pageNumber ===
              pagesHistory.value[historyIndex.value].pageNumber
            );
          });

          const canvas = desiredPage?.canvas;

          // Wait for the canvas to load and render before breaking
          await canvas?.loadFromJSON(
            pagesHistory.value[historyIndex.value].json
          );
          canvas && canvas.requestRenderAll();
        } else {
          historyIndex.value++;

          JSONLoading.value = true;

          console.log("HISTORY", pagesHistory.value, historyIndex.value);

          const desiredPage = reactivePages.value.find((page) => {
            return (
              page.pageNumber ===
              pagesHistory.value[historyIndex.value].pageNumber
            );
          });

          const canvas = desiredPage?.canvas;

          // Wait for the canvas to load and render before breaking
          await canvas?.loadFromJSON(
            pagesHistory.value[historyIndex.value].json
          );
          canvas && canvas.requestRenderAll();
          JSONLoading.value = false;
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
