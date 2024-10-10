import {
  Canvas,
  type FabricObject,
  type TFiller,
  type TOriginX,
  type TOriginY,
} from "fabric";
import { v4 as uuid } from "uuid";
import { type Ref } from "vue";
import SnapLinesHelper from "./snapLines";
import { bringBleedlinesToFront } from "./bringBleedlinesToFront";

const propertiesToInclude = ["id", "linePosition", "lineType"];

interface cardHistory {
  cardSide: string;
  activeObject: CustomLineOptions | null;
  actionType?: string;
  json: JSON;
}

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

interface CardData {
  cardSide: string;
  cardID: string;
  canvas: Canvas;
  loading: boolean;
}

class Card {
  canvas: Canvas | null;
  cardID: string;
  objectsArray: FabricObject[];
  frontThumbnail: Ref<string | null>;
  backThumbnail: Ref<string | null>;
  width_px: number;
  height_px: number;
  cardHistory: Ref<cardHistory[]>;
  currentActionIndex: Ref<number>;
  loading: Ref<boolean>;
  cardSide: string;
  activeObject: Ref<FabricObject | null>;

  constructor(
    actualSize: { width_mm: number; height_mm: number; dpi: number },
    cardSide: string,
    cardHistory: Ref<cardHistory[]>,
    currentActionIndex: Ref<number>,
    JSONLoading: Ref<boolean>,
    containerRef: HTMLCanvasElement | null,
    modeType: string,
    activeObjectRef: Ref<FabricObject | null>,
    cardFrontThumbnail: Ref<string | null>,
    cardBackThumbnail: Ref<string | null>,
    cardsData: Ref<CardData[]>
  ) {
    this.cardID = uuid();
    this.cardSide = cardSide;
    this.objectsArray = [];
    this.frontThumbnail = cardFrontThumbnail;
    this.backThumbnail = cardBackThumbnail;

    this.width_px = (actualSize.width_mm / 25.4) * actualSize.dpi;
    this.height_px = (actualSize.height_mm / 25.4) * actualSize.dpi;
    this.cardHistory = cardHistory;
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
      new SnapLinesHelper(this.canvas);
      let jsonObject = {};
      let emptyJSON = "";

      setTimeout(() => {
        if (this.canvas) jsonObject = this.canvas.toObject(propertiesToInclude);
        emptyJSON = JSON.stringify(jsonObject);
      }, 0);

      this.canvas.on("mouse:down", (e) => {
        if (modeType === "card" && this.activeObject && e.target)
          this.activeObject.value = e.target;
      });

      this.canvas.on("object:added", (e) => {
        if (modeType === "card" && this.canvas && e.target) {
          if (this.cardSide === "Front") {
            this.frontThumbnail.value = this.canvas.toDataURL();
          } else {
            this.backThumbnail.value = this.canvas.toDataURL();
          }
        }

        const canvasObjects = this.canvas && this.canvas.getObjects();
        const obj = e.target as CustomLineOptions;

        if (obj && obj.lineType && obj.lineType === "bleedline") {
          obj.set({
            selectable: false,
            hasControls: false,
          });
        }

        if (
          canvasObjects &&
          canvasObjects.length <= 7 &&
          this.loading.value === false &&
          emptyJSON
        ) {
          this.cardHistory.value.push({
            cardSide: this.cardSide,
            activeObject: null,
            json: JSON.parse(emptyJSON),
          });
          currentActionIndex.value++;
        }

        if (e.target.id !== "frame") {
          saveState(obj);
        }

        if (this.canvas) bringBleedlinesToFront(this.canvas);

        if (this.canvas)
          this.canvas.getObjects().forEach((object) => {
            const obj = object as CustomLineOptions;

            if (this.canvas && obj.lineType === "perforation") {
              this.canvas.bringObjectToFront(obj);
            }
          });
      });

      this.canvas.on("object:modified", (e) => {
        if (modeType === "card" && this.canvas && e.target) {
          if (this.cardSide === "Front") {
            this.frontThumbnail.value = this.canvas.toDataURL();
          } else {
            this.backThumbnail.value = this.canvas.toDataURL();
          }
        }

        if (e.target && this.canvas) {
          const zoom = this.canvas.getZoom();
          const object = e.target as CustomLineOptions;
          if (object.type === "line") {
            if (this.cardSide === "Front") {
              const mirroredLine = cardsData.value[1].canvas
                .getObjects()
                .find((line) => {
                  if (this.canvas) {
                    return e.target.id === line.id;
                  }
                });

              if (
                this.canvas &&
                zoom &&
                object.linePosition === "vertical" &&
                mirroredLine
              ) {
                mirroredLine.set({
                  left: this.canvas.width / zoom - e.target.left,
                  top: this.canvas.height / zoom - e.target.top,
                });
              } else {
                if (mirroredLine)
                  mirroredLine.set({
                    left: object.left,
                    top: object.top,
                  });
              }

              mirroredLine && mirroredLine.setCoords();

              this.backThumbnail.value = cardsData.value[1].canvas.toDataURL();
              cardsData.value[1].canvas.requestRenderAll();
            } else if (this.cardSide === "Back") {
              const mirroredLine = cardsData.value[0].canvas
                .getObjects()
                .find((line) => {
                  if (this.canvas) {
                    return e.target.id === line.id;
                  }
                });

              if (
                this.canvas &&
                zoom &&
                object.linePosition === "vertical" &&
                mirroredLine
              ) {
                mirroredLine.set({
                  left: this.canvas.width / zoom - e.target.left,
                  top: this.canvas.height / zoom - e.target.top,
                });
              } else if (mirroredLine) {
                mirroredLine.set({
                  left: object.left,
                  top: object.top,
                });
              }

              mirroredLine && mirroredLine.setCoords();

              this.frontThumbnail.value = cardsData.value[0].canvas.toDataURL();
              cardsData.value[0].canvas.requestRenderAll();
            }
          }
        }

        const obj = e.target as CustomLineOptions;
        saveState(obj, "modified");
      });

      this.canvas.on("object:removed", (e) => {
        if (modeType === "card" && this.canvas && e.target) {
          if (this.cardSide === "Front") {
            this.frontThumbnail.value = this.canvas.toDataURL();
          } else {
            this.backThumbnail.value = this.canvas.toDataURL();
          }
        }

        if (e.target.id !== "frame") {
          const object = e.target as CustomLineOptions;
          saveState(object);
        }

        const obj = e.target as CustomLineOptions;

        if (
          obj.type === "line" &&
          obj.lineType === "perforation" &&
          obj.linePosition === "vertical" &&
          this.loading.value === false
        ) {
          if (this.cardSide === "Front") {
            const mirrorLine = cardsData.value[1].canvas
              .getObjects()
              .find((obj) => {
                return e.target.id === obj.id;
              });

            mirrorLine && cardsData.value[1].canvas.remove(mirrorLine);
            this.backThumbnail.value = cardsData.value[1].canvas.toDataURL();
            cardsData.value[1].canvas.requestRenderAll();
          } else if (
            this.cardSide === "Back" &&
            obj.linePosition === "vertical"
          ) {
            const mirrorLine = cardsData.value[0].canvas
              .getObjects()
              .find((obj) => {
                return e.target.id === obj.id;
              });

            mirrorLine && cardsData.value[0].canvas.remove(mirrorLine);
            this.backThumbnail.value = cardsData.value[0].canvas.toDataURL();
            cardsData.value[0].canvas.requestRenderAll();
          }
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

    const saveState = (
      activeObject: CustomLineOptions,
      action: string = ""
    ) => {
      if (this.canvas && !this.loading.value) {
        if (this.currentActionIndex.value < this.cardHistory.value.length - 1) {
          this.cardHistory.value = this.cardHistory.value.slice(
            0,
            this.currentActionIndex.value + 1
          );
        }

        this.loading.value = false;
        if (this.canvas)
          this.cardHistory.value.push({
            cardSide: this.cardSide,
            activeObject: activeObject,
            json: this.canvas.toObject(propertiesToInclude),
          });

        if (activeObject.lineType === "perforation" && action === "modified") {
          const mirroedCardSide = this.cardSide === "Front" ? "Back" : "Front";
          const card =
            mirroedCardSide === "Front"
              ? cardsData.value[0]
              : cardsData.value[1];

          const modifiedLine = card.canvas.getObjects().find((obj) => {
            return obj.id === activeObject.id;
          });

          if (card.canvas)
            this.cardHistory.value.push({
              cardSide: card.cardSide,
              activeObject: modifiedLine as FabricObject,
              actionType: "modified",
              json: card.canvas.toObject(propertiesToInclude),
            });

          this.currentActionIndex.value++;
        }

        if (this.cardSide === "Front") {
          this.frontThumbnail.value = this.canvas.toDataURL();
        } else {
          this.backThumbnail.value = this.canvas.toDataURL();
        }

        this.currentActionIndex.value++;

        if (this.cardHistory.value.length > 50) {
          this.cardHistory.value.shift();
        }
      }
    };
  }
}

export default Card;
