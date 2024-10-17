import {
  Canvas,
  FabricImage,
  type FabricObject,
  type TFiller,
  type TOriginX,
  type TOriginY,
} from "fabric";
import { v4 as uuid } from "uuid";
import { type Ref } from "vue";
import SnapLinesHelper from "./snapLines";

const propertiesToInclude = ["id", "linePosition", "lineType", "padding"];

interface CustomLineOptions extends FabricObject {
  linePosition?: string;
  lineType?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  stroke: string | TFiller | null;
  strokeDashArray: number[] | null;
  selectable: boolean;
  evented: boolean;
  originX: TOriginX;
  originY: TOriginY;
  opacity: number;
  strokeWidth: number;
  layout?: boolean;
  padding: number;
}

interface allPagesCanvasesRef {
  canvas: Canvas[];
  thumbnail: string[];
}

interface History {
  pageNumber: number;
  activeObject: CustomLineOptions | null;
  actionType?: string;
  json: JSON;
}

enum TargetID {
  FRAME = "frame",
  FIRST_PAGE_COVER = "firstPageCover",
  COVER = "cover",
}

const excludedIds = [TargetID.FRAME, TargetID.FIRST_PAGE_COVER, TargetID.COVER];

class Page {
  canvas: Canvas | null;
  pageNumber: number;
  pageID: string;
  objectsArray: FabricObject[];
  canvasElement: HTMLCanvasElement | null;
  thumbnail: Ref<string>;
  width_px: number;
  height_px: number;
  activeObjectRef: Ref<FabricObject | null>;
  allCanvasesRef: Ref<allPagesCanvasesRef>;
  history: Ref<History[]>;
  currentActionIndex: Ref<number>;
  loading: Ref<boolean>;
  emptyJSON: string;
  jsonObject: object;

  constructor(
    actualSize: { width_mm: number; height_mm: number; dpi: number },
    pageNumber: number,
    containerRef: HTMLElement | null,
    activeObjectRef: Ref<FabricObject | null>,
    allCanvasesRef: Ref<allPagesCanvasesRef>,
    history: Ref<History[]>,
    currentActionIndex: Ref<number>,
    JSONLoading: Ref<boolean>
  ) {
    this.pageID = uuid();
    this.pageNumber = pageNumber;
    this.objectsArray = [];
    this.thumbnail = ref("");
    this.width_px = (actualSize.width_mm / 25.4) * actualSize.dpi;
    this.height_px = (actualSize.height_mm / 25.4) * actualSize.dpi;
    this.activeObjectRef = activeObjectRef;
    this.allCanvasesRef = allCanvasesRef;
    this.history = history;
    this.currentActionIndex = currentActionIndex;
    this.loading = JSONLoading;
    this.emptyJSON = "";
    this.jsonObject = {};

    const canvasElement = document.createElement("canvas");
    canvasElement.id = this.pageID;

    if (containerRef) {
      containerRef.appendChild(canvasElement);
    } else {
      console.error(`Container ref is null.`);
    }

    canvasElement.style.position = "relative";
    canvasElement.style.paddingBottom = "5px";
    canvasElement.style.paddingRight = "5px";

    this.canvasElement = canvasElement;

    this.canvas = null;

    this.init();
    this.overlayCreation();
    this.handleEvents();
    this.renderCanvas();
  }

  init() {
    if (this.canvasElement)
      this.canvas = markRaw(
        new Canvas(this.canvasElement, {
          id: this.pageID,
          width: this.width_px,
          height: this.height_px,
          backgroundColor: "white",
          preserveObjectStacking: true,
          fill: "white",
        })
      );

    if (this.canvas) {
      this.canvas.wrapperEl.style.border = "2px solid black";
      new SnapLinesHelper(this.canvas);
    }
  }

  overlayCreation() {
    if (this.canvas) {
      const frame = new URL("@/assets/pagesFrame.png", import.meta.url).href;
      if (frame)
        FabricImage.fromURL(frame).then((loadedImg) => {
          if (this.canvas && loadedImg) {
            loadedImg.set({
              id: "frame",
              selectable: false,
              hasControls: false,
            });

            loadedImg.scaleToWidth(this.canvas.width / this.canvas.getZoom());
            loadedImg.scaleToHeight(this.canvas.height / this.canvas.getZoom());
            loadedImg.setCoords();

            setTimeout(() => {
              this.jsonObject =
                this.allCanvasesRef.value.canvas[1].toObject(
                  propertiesToInclude
                );
              this.emptyJSON = JSON.stringify(this.jsonObject);
            }, 0);

            if (this.pageNumber === 2) {
              this.canvas.set({
                overlayImage: loadedImg,
              });
            }

            if (
              this.pageNumber !== 1 &&
              this.pageNumber !== this.allCanvasesRef.value.canvas.length
            )
              this.canvas.set({
                overlayImage: loadedImg,
              });

            if (this.allCanvasesRef.value) {
              this.allCanvasesRef.value.thumbnail[this.pageNumber - 1] =
                this.canvas.toDataURL();
            }

            this.canvas.renderAll();
          }
        });
    }
  }

  handleEvents() {
    if (this.canvas) {
      this.canvas.on("mouse:down", (e) => {
        const obj = e.target as FabricObject;

        this.activeObjectRef.value = obj;
      });

      this.canvas.on("object:added", (e) => {
        setTimeout(() => {
          if (this.canvas && this.allCanvasesRef.value) {
            this.allCanvasesRef.value.thumbnail[this.pageNumber - 1] =
              this.canvas.toDataURL();
          }
        }, 0);

        if (this.canvas) {
          const canvasObjects = this.canvas.getObjects();

          const obj = e.target as CustomLineOptions;

          if (
            canvasObjects &&
            canvasObjects.length <= 3 &&
            canvasObjects[2] &&
            canvasObjects[2].type !== "rect" &&
            !this.loading.value &&
            this.emptyJSON
          ) {
            this.history.value.push({
              pageNumber: this.pageNumber,
              activeObject: null,
              json: JSON.parse(this.emptyJSON),
            });
            this.currentActionIndex.value += 1;
          }

          if (!excludedIds.includes(obj.id as TargetID)) {
            this.saveState(obj);
          }
        }
      });

      this.canvas.on("object:modified", (e) => {
        const obj = e.target as CustomLineOptions;

        if (obj.lineType === "perforation") {
          if (this.pageNumber % 2 === 0 && this.canvas) {
            const zoom = this.canvas.getZoom();
            const nextCanvas =
              this.allCanvasesRef.value.canvas[this.pageNumber];
            const otherLine = nextCanvas
              .getObjects()
              .find((obj) => obj.id === e.target.id);

            if (
              this.canvas &&
              zoom &&
              obj.linePosition === "vertical" &&
              otherLine
            ) {
              otherLine.set({
                left: this.canvas.width / zoom - e.target.left,
                top: this.canvas.height / zoom - e.target.top,
              });
            } else if (otherLine) {
              otherLine.set({
                left: obj.left,
                top: obj.top,
              });
            }

            this.allCanvasesRef.value.thumbnail[this.pageNumber] =
              nextCanvas.toDataURL();

            nextCanvas.requestRenderAll();
          } else if (this.canvas) {
            const zoom = this.canvas.getZoom();
            const previousCanvas =
              this.allCanvasesRef.value.canvas[this.pageNumber - 2];
            const otherLine = previousCanvas
              .getObjects()
              .find((obj) => obj.id === e.target.id);

            if (
              this.canvas &&
              zoom &&
              obj.linePosition === "vertical" &&
              otherLine
            ) {
              otherLine.set({
                left: this.canvas.width / zoom - e.target.left,
                top: this.canvas.height / zoom - e.target.top,
              });
            } else if (otherLine) {
              otherLine.set({
                left: obj.left,
                top: obj.top,
              });
            }

            this.allCanvasesRef.value.thumbnail[this.pageNumber - 2] =
              previousCanvas.toDataURL();

            previousCanvas.requestRenderAll();
          }
        }

        if (e.target && this.thumbnail && this.canvas) {
          this.allCanvasesRef.value.thumbnail[this.pageNumber - 1] =
            this.canvas.toDataURL();
        }

        this.saveState(obj, "modified");
      });

      this.canvas.on("object:removed", (e) => {
        const obj = e.target as CustomLineOptions;

        if (
          e.target &&
          this.thumbnail &&
          this.canvas &&
          this.allCanvasesRef.value &&
          !this.loading.value
        )
          this.allCanvasesRef.value.thumbnail[this.pageNumber - 1] =
            this.canvas.toDataURL();

        if (
          e.target.id !== "frame" &&
          e.target.id !== "firstPageCover" &&
          e.target.id !== "cover"
        ) {
          this.saveState(obj);
        }

        if (obj.lineType === "perforation" && this.canvas) {
          const mirrorLine = this.canvas.getObjects().find((object) => {
            return obj.id === object.id;
          });

          mirrorLine && this.canvas.remove(mirrorLine);
          this.renderCanvas();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Delete" && this.canvas) {
          const activeObject = this.canvas.getActiveObject();
          if (activeObject) {
            this.canvas.remove(activeObject);
            this.renderCanvas();
          }
        }
      });
    }
  }

  renderCanvas() {
    if (this.canvas) this.canvas.requestRenderAll();
  }

  saveState(activeObject: CustomLineOptions, action: string = "") {
    const currHistory = this.history.value[this.currentActionIndex.value];

    const currentHistoryObject =
      currHistory &&
      this.history.value[this.currentActionIndex.value].activeObject;

    if (this.canvas && !this.loading.value) {
      if (this.currentActionIndex.value < this.history.value.length - 1) {
        this.history.value = this.history.value.slice(
          0,
          this.currentActionIndex.value <= 1 &&
            currentHistoryObject &&
            activeObject.lineType !== "perforation"
            ? this.currentActionIndex.value
            : this.currentActionIndex.value + 1
        );

        setTimeout(() => {
          if (this.currentActionIndex.value <= 1) {
            this.history.value[0].pageNumber =
              this.history.value[this.currentActionIndex.value].pageNumber;
          }
        }, 0);

        if (this.currentActionIndex.value === 1) {
          this.currentActionIndex.value = 0;
        }
      }

      this.loading.value = false;
      if (this.canvas)
        this.history.value.push({
          pageNumber: this.pageNumber,
          activeObject: activeObject,
          json: this.canvas.toObject(propertiesToInclude),
        });

      if (activeObject.lineType === "perforation" && action === "modified") {
        const mirroedPageNumber =
          this.pageNumber % 2 === 0
            ? this.pageNumber + 1 // IF PAGE NUMBER IS EVEN THEN MIRRORED PAGE NUMBER WILL BE NEXT PAGE
            : this.pageNumber - 1; // IF PAGE NUMBER IS ODD THEN MIRRORED PAGE NUMBER WILL BE PREVIOUS PAGE

        const mirroredCanvas =
          this.allCanvasesRef.value.canvas[mirroedPageNumber - 1];

        const modifiedLine = mirroredCanvas.getObjects().find((obj) => {
          return obj.id === activeObject.id;
        });

        this.history.value.push({
          pageNumber: mirroedPageNumber,
          activeObject: modifiedLine as FabricObject,
          actionType: "modified",
          json: mirroredCanvas.toObject(propertiesToInclude),
        });

        this.currentActionIndex.value += 1;
      }

      this.thumbnail.value = this.canvas.toDataURL();

      this.currentActionIndex.value += 1;

      if (this.history.value.length > 50) {
        this.history.value.shift();
      }
    }
  }
}

export default Page;
