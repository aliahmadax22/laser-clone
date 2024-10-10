import {
  Canvas,
  FabricImage,
  type FabricObject,
  type TFiller,
  type TOriginX,
  type TOriginY,
  //   type TOriginX,
  //   type TOriginY,
} from "fabric";
import { v4 as uuid } from "uuid";
import { type Ref } from "vue";
import SnapLinesHelper from "./snapLines";

// const test = `{
//   "version": "6.0.2",
//   "objects": [
//   {
//       "type": "Line",
//       "version": "6.0.2",
//       "originX": "left",
//       "originY": "top",
//       "left": 354.0807,
//       "top": -0.25,
//       "width": 0,
//       "height": 708.6614,
//       "fill": "rgb(0,0,0)",
//       "stroke": "rgb(178, 207, 255)",
//       "strokeWidth": 0.5,
//       "strokeDashArray": null,
//       "strokeLineCap": "butt",
//       "strokeDashOffset": 0,
//       "strokeLineJoin": "miter",
//       "strokeUniform": false,
//       "strokeMiterLimit": 4,
//       "scaleX": 1,
//       "scaleY": 1,
//       "angle": 0,
//       "flipX": false,
//       "flipY": false,
//       "opacity": 1,
//       "shadow": null,
//       "visible": false,
//       "backgroundColor": "",
//       "fillRule": "nonzero",
//       "paintFirst": "fill",
//       "globalCompositeOperation": "source-over",
//       "skewX": 0,
//       "skewY": 0,
//       "x1": 0,
//       "x2": 0,
//       "y1": -354.33070866141736,
//       "y2": 354.33070866141736
//   },
//   {
//       "type": "Line",
//       "version": "6.0.2",
//       "originX": "left",
//       "originY": "top",
//       "left": -0.25,
//       "top": 354.0807,
//       "width": 708.6614,
//       "height": 0,
//       "fill": "rgb(0,0,0)",
//       "stroke": "rgb(178, 207, 255)",
//       "strokeWidth": 0.5,
//       "strokeDashArray": null,
//       "strokeLineCap": "butt",
//       "strokeDashOffset": 0,
//       "strokeLineJoin": "miter",
//       "strokeUniform": false,
//       "strokeMiterLimit": 4,
//       "scaleX": 1,
//       "scaleY": 1,
//       "angle": 0,
//       "flipX": false,
//       "flipY": false,
//       "opacity": 1,
//       "shadow": null,
//       "visible": false,
//       "backgroundColor": "",
//       "fillRule": "nonzero",
//       "paintFirst": "fill",
//       "globalCompositeOperation": "source-over",
//       "skewX": 0,
//       "skewY": 0,
//       "x1": -354.33070866141736,
//       "x2": 354.33070866141736,
//       "y1": 0,
//       "y2": 0
//   }
// ],
//   "background": "white"
// }`;

const propertiesToInclude = ["id", "linePosition", "lineType"];

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

    this.width_px = (actualSize.width_mm / 25.4) * actualSize.dpi;
    this.height_px = (actualSize.height_mm / 25.4) * actualSize.dpi;
    this.coverHistory = coverHistory;
    this.currentActionIndex = currentActionIndex;
    this.loading = JSONLoading;
    this.activeObject = activeObjectRef;

    this.canvas = null;

    if (containerRef)
      this.canvas = markRaw(
        new Canvas(containerRef, {
          width: this.width_px,
          height: this.height_px,
          backgroundColor: "white",
          preserveObjectStacking: true,
          fill: "white",
        })
      );

    if (this.canvas) {
      let jsonObject = {};
      let emptyJSON = "";

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
            // loadedImg.scaleToHeight(this.canvas.height / this.canvas.getZoom());
            loadedImg.setCoords();

            setTimeout(() => {
              if (this.canvas)
                jsonObject = this.canvas.toObject(propertiesToInclude);
              emptyJSON = JSON.stringify(jsonObject);
            }, 0);

            this.canvas.set({
              overlayImage: loadedImg,
            });

            setTimeout(() => {
              if (this.canvas) {
                this.LeftThumbnail.value = this.canvas.toDataURL();
                this.RightThumbnail.value = this.canvas.toDataURL();
                this.MiddleThumbnail.value =
                  coverData.value[1].canvas.toDataURL();
              }
            }, 0);

            this.canvas.renderAll();
          }
        });

      new SnapLinesHelper(this.canvas);

      this.canvas.on("mouse:down", (e) => {
        if (e.target) this.activeObject.value = e.target;

        activeCoverRef.value = this.coverSide;
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
            canvasObjects.length <= 3 &&
            this.loading.value === false
          ) {
            this.coverHistory.value.push({
              coverSide: this.coverSide,
              activeObject: null,
              json: JSON.parse(emptyJSON),
            });
            currentActionIndex.value++;
          }
        }

        const obj = e.target as CustomLineOptions;

        if (e.target.id !== "frame") {
          saveState(obj);
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

        saveState(obj);
      });

      this.canvas.on("object:removed", (e) => {
        if (modeType === "cover" && this.canvas && e.target) {
          if (this.coverSide === "Left") {
            this.LeftThumbnail.value = this.canvas.toDataURL();
          } else if (this.coverSide === "Middle") {
            this.MiddleThumbnail.value = this.canvas.toDataURL();
          } else {
            this.RightThumbnail.value = this.canvas.toDataURL();
          }
        }

        const obj = e.target as CustomLineOptions;

        if (e.target.id !== "frame") {
          saveState(obj);
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

      this.canvas.requestRenderAll();
    }

    const saveState = (activeObject: CustomLineOptions) => {
      if (this.canvas && !this.loading.value) {
        if (
          this.currentActionIndex.value <
          this.coverHistory.value.length - 1
        ) {
          this.coverHistory.value = this.coverHistory.value.slice(
            0,
            this.currentActionIndex.value + 1
          );
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

        this.currentActionIndex.value++;

        if (this.coverHistory.value.length > 50) {
          this.coverHistory.value.shift();
        }
      }
    };
  }
}

export default Cover;
