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
// import SnapLinesHelper from "./snapLines";
import SnaplinesBeta from "./snapsbeta";

const propertiesToInclude = [
  "id",
  "linePosition",
  "lineType",
  "padding",
  "visible",
];

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

interface coverHistory {
  coverSide: string;
  activeObject: CustomLineOptions | null;
  json: JSON;
}

interface coverData {
  coverSide: string;
  coverID: string;
  canvas: Canvas;
}

class Cover {
  canvas: Canvas | null;
  coverID: string;
  objectsArray: FabricObject[];
  LeftThumbnail: Ref<string | null>;
  MiddleThumbnail: Ref<string | null>;
  RightThumbnail: Ref<string | null>;
  width_px: number;
  height_px: number;
  coverHistory: Ref<coverHistory[]>;
  currentActionIndex: Ref<number>;
  loading: Ref<boolean>;
  coverSide: string;
  activeObject: Ref<FabricObject | null>;
  activeCoverRef: Ref<string>;
  jsonObject: object;
  emptyJSON: string;
  coverData: Ref<coverData[]>;
  containerRef: HTMLCanvasElement | null;

  constructor(
    actualSize: { width_mm: number; height_mm: number; dpi: number },
    coverSide: string,
    coverHistory: Ref<coverHistory[]>,
    currentActionIndex: Ref<number>,
    JSONLoading: Ref<boolean>,
    containerRef: HTMLCanvasElement | null,
    modeType: string,
    activeObjectRef: Ref<FabricObject | null>,
    cardLeftThumbnail: Ref<string | null>,
    cardMiddleThumbnail: Ref<string | null>,
    cardRightThumbnail: Ref<string | null>,
    coverData: Ref<coverData[]>,
    activeCoverRef: Ref<string>
  ) {
    this.coverID = uuid();
    this.coverSide = coverSide;
    this.objectsArray = [];
    this.LeftThumbnail = cardLeftThumbnail;
    this.MiddleThumbnail = cardMiddleThumbnail;
    this.RightThumbnail = cardRightThumbnail;
    this.activeCoverRef = activeCoverRef;
    this.width_px = (actualSize.width_mm / 25.4) * actualSize.dpi;
    this.height_px = (actualSize.height_mm / 25.4) * actualSize.dpi;
    this.coverHistory = coverHistory;
    this.currentActionIndex = currentActionIndex;
    this.loading = JSONLoading;
    this.activeObject = activeObjectRef;
    this.coverData = coverData;
    this.containerRef = containerRef;
    this.jsonObject = {};
    this.emptyJSON = "";

    this.canvas = null;

    this.init();
    this.overlayCreation();
    this.handleEvents();
    this.renderCanvas();
  }

  init() {
    if (this.containerRef)
      this.canvas = markRaw(
        new Canvas(this.containerRef, {
          width: this.width_px,
          height: this.height_px,
          backgroundColor: "white",
          preserveObjectStacking: true,
          fill: "white",
        })
      );

    // if (this.canvas) new SnapLinesHelper(this.canvas);
    if (this.canvas) new SnaplinesBeta(this.canvas);
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

            if (this.coverSide === "Middle") {
              loadedImg.scaleToHeight(
                this.canvas.height / this.canvas.getZoom()
              );
            } else {
              loadedImg.scaleToWidth(this.canvas.width / this.canvas.getZoom());
            }
            loadedImg.setCoords();

            setTimeout(() => {
              if (this.canvas)
                this.jsonObject = this.canvas.toObject(propertiesToInclude);
              this.emptyJSON = JSON.stringify(this.jsonObject);
            }, 0);

            this.canvas.set({
              overlayImage: loadedImg,
            });

            setTimeout(() => {
              if (this.canvas && this.coverData.value[1].canvas) {
                this.LeftThumbnail.value = this.canvas.toDataURL();
                this.RightThumbnail.value = this.canvas.toDataURL();
                this.MiddleThumbnail.value =
                  this.coverData.value[1].canvas.toDataURL();
              }
            }, 0);

            this.renderCanvas();
          }
        });
    }
  }

  handleEvents() {
    if (this.canvas) {
      this.canvas.on("mouse:down", (e) => {
        if (e.target) this.activeObject.value = e.target;

        this.activeCoverRef.value = this.coverSide;
      });

      this.canvas.on("object:added", (e) => {
        if (this.canvas) {
          if (this.coverSide === "Left") {
            setTimeout(() => {
              this.LeftThumbnail.value = this.canvas && this.canvas.toDataURL();
            }, 0);
          } else if (this.coverSide === "Middle") {
            setTimeout(() => {
              this.MiddleThumbnail.value =
                this.canvas && this.canvas.toDataURL();
            }, 0);
          } else {
            setTimeout(() => {
              this.RightThumbnail.value =
                this.canvas && this.canvas.toDataURL();
            }, 0);
          }
        }

        if (this.canvas) {
          const canvasObjects = this.canvas.getObjects();

          if (
            canvasObjects &&
            canvasObjects.length <= 7 &&
            !this.loading.value
          ) {
            this.coverHistory.value.push({
              coverSide: this.coverSide,
              activeObject: null,
              json: JSON.parse(this.emptyJSON),
            });
            this.currentActionIndex.value += 1;
          }
        }

        const obj = e.target as CustomLineOptions;

        if (e.target.id !== "frame" && obj.lineType !== "snap") {
          this.saveState(obj);
        }
      });

      this.canvas.on("object:modified", (e) => {
        if (this.coverSide === "Left") {
          this.LeftThumbnail.value = this.canvas && this.canvas.toDataURL();
        } else if (this.coverSide === "Middle") {
          this.MiddleThumbnail.value = this.canvas && this.canvas.toDataURL();
        } else {
          this.RightThumbnail.value = this.canvas && this.canvas.toDataURL();
        }

        const obj = e.target as CustomLineOptions;

        this.saveState(obj);
      });

      this.canvas.on("object:removed", (e) => {
        if (this.canvas && e.target) {
          if (this.coverSide === "Left") {
            this.LeftThumbnail.value = this.canvas.toDataURL();
          } else if (this.coverSide === "Middle") {
            this.MiddleThumbnail.value = this.canvas.toDataURL();
          } else {
            this.RightThumbnail.value = this.canvas.toDataURL();
          }
        }

        const obj = e.target as CustomLineOptions;

        if (e.target.id !== "frame" && obj.lineType !== "snap") {
          this.saveState(obj);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Delete" && this.canvas) {
          const activeObject = this.canvas.getActiveObject();
          if (activeObject) {
            this.canvas.remove(activeObject);
          }
        }
      });
    }
  }

  renderCanvas() {
    if (this.canvas) this.canvas.requestRenderAll();
  }

  saveState(activeObject: CustomLineOptions) {
    if (this.canvas && !this.loading.value) {
      if (this.currentActionIndex.value < this.coverHistory.value.length - 1) {
        this.coverHistory.value = this.coverHistory.value.slice(
          0,
          this.currentActionIndex.value <= 1
            ? this.currentActionIndex.value
            : this.currentActionIndex.value + 1
        );

        setTimeout(() => {
          if (this.currentActionIndex.value <= 1) {
            this.coverHistory.value[0].coverSide =
              this.coverHistory.value[this.currentActionIndex.value].coverSide;
          }
        }, 0);

        if (this.currentActionIndex.value === 1) {
          this.currentActionIndex.value = 0;
        }
      }

      this.loading.value = false;
      if (this.canvas)
        this.coverHistory.value.push({
          coverSide: this.coverSide,
          activeObject: activeObject,
          json: this.canvas.toObject(),
        });

      if (this.coverSide === "Left") {
        this.LeftThumbnail.value = this.canvas.toDataURL();
      } else if (this.coverSide === "Right") {
        this.RightThumbnail.value = this.canvas.toDataURL();
      } else {
        this.MiddleThumbnail.value = this.canvas.toDataURL();
      }

      this.currentActionIndex.value += 1;

      if (this.coverHistory.value.length > 50) {
        this.coverHistory.value.shift();
      }
    }
  }
}

export default Cover;
