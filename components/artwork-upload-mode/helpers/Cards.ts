import {
  Canvas,
  type FabricObject,
  type TFiller,
  type TOriginX,
  type TOriginY,
} from "fabric";
import { v4 as uuid } from "uuid";
import { type Ref } from "vue";
// import SnapLinesHelper from "./snapLines";
import { bringBleedlinesToFront } from "./bringBleedlinesToFront";
import SnaplinesBeta from "./snapsbeta";

const propertiesToInclude = [
  "id",
  "linePosition",
  "lineType",
  "padding",
  "visible",
];

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

let emptyJsonFront: string;
let emptyJsonBack: string;

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
  cardsData: Ref<CardData[]>;
  jsonObject: object;
  emptyJSON: string;
  containerRef: HTMLCanvasElement | null;

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
    this.cardsData = cardsData;
    this.width_px = (actualSize.width_mm / 25.4) * actualSize.dpi;
    this.height_px = (actualSize.height_mm / 25.4) * actualSize.dpi;
    this.cardHistory = cardHistory;
    this.currentActionIndex = currentActionIndex;
    this.loading = JSONLoading;
    this.activeObject = activeObjectRef;
    this.jsonObject = {};
    this.emptyJSON = "";
    this.containerRef = containerRef;
    this.canvas = null;

    this.init();
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

    if (this.canvas) {
      // new SnapLinesHelper(this.canvas);
      if (!this.loading.value) new SnaplinesBeta(this.canvas);

      const saveJsonData = () => {
        if (this.canvas) {
          this.jsonObject = this.canvas.toObject(propertiesToInclude);
          this.emptyJSON = JSON.stringify(this.jsonObject);

          if (this.cardSide === "Front") {
            const jsonObject = this.canvas.toObject(propertiesToInclude);
            emptyJsonFront = JSON.stringify(jsonObject);
          } else if (this.cardSide === "Back") {
            const jsonObject = this.canvas.toObject(propertiesToInclude);
            emptyJsonBack = JSON.stringify(jsonObject);
          }
        }
      };

      requestAnimationFrame(saveJsonData);
    }
  }

  handleEvents() {
    if (this.canvas) {
      this.canvas.on("mouse:down", (e) => {
        if (this.activeObject && e.target) this.activeObject.value = e.target;
      });

      this.canvas.on("object:added", (e) => {
        this.refreshThumbnails();

        const obj = e.target as CustomLineOptions;

        if (obj && obj.lineType && obj.lineType === "bleedline") {
          obj.set({
            selectable: false,
            hasControls: false,
          });
        }

        !this.loading.value && this.handleEmptyHistory("add");

        if (e.target.id !== "frame") {
          this.saveState(obj);
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
        this.refreshThumbnails();

        const obj = e.target as CustomLineOptions;

        // if (
        //   localCardsData &&
        //   !this.loading.value &&
        //   this.cardHistory.value.length === 0
        // ) {
        //   this.cardHistory.value.push({
        //     cardSide: this.cardSide,
        //     activeObject: null,
        //     json: JSON.parse(this.emptyJSON),
        //   });
        //   this.currentActionIndex.value += 1;
        // }

        this.handleEmptyHistory();

        if (e.target && this.canvas) {
          const zoom = this.canvas.getZoom();
          const object = e.target as CustomLineOptions;
          if (object.type === "line") {
            if (this.cardSide === "Front") {
              const mirroredLine = this.cardsData.value[1].canvas
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

              this.backThumbnail.value =
                this.cardsData.value[1].canvas.toDataURL();
              this.cardsData.value[1].canvas.requestRenderAll();
            } else if (this.cardSide === "Back") {
              const mirroredLine = this.cardsData.value[0].canvas
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

              this.frontThumbnail.value =
                this.cardsData.value[0].canvas.toDataURL();
              this.cardsData.value[0].canvas.requestRenderAll();
            }
          }
        }

        this.saveState(obj, "modified");
      });

      this.canvas.on("object:removed", (e) => {
        this.refreshThumbnails();

        this.handleEmptyHistory();

        if (e.target.id !== "frame") {
          const object = e.target as CustomLineOptions;
          this.saveState(object);
        }

        const obj = e.target as CustomLineOptions;

        if (
          obj.type === "line" &&
          obj.lineType === "perforation" &&
          !this.loading.value
        ) {
          if (this.cardSide === "Front") {
            const mirrorLine = this.cardsData.value[1].canvas
              .getObjects()
              .find((obj) => {
                return e.target.id === obj.id;
              });

            mirrorLine && this.cardsData.value[1].canvas.remove(mirrorLine);
            this.backThumbnail.value =
              this.cardsData.value[1].canvas.toDataURL();
            this.cardsData.value[1].canvas.requestRenderAll();
          } else if (
            this.cardSide === "Back" &&
            obj.lineType === "perforation"
          ) {
            const mirrorLine = this.cardsData.value[0].canvas
              .getObjects()
              .find((obj) => {
                return e.target.id === obj.id;
              });

            mirrorLine && this.cardsData.value[0].canvas.remove(mirrorLine);
            this.backThumbnail.value =
              this.cardsData.value[0].canvas.toDataURL();
            this.cardsData.value[0].canvas.requestRenderAll();
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
    }
  }

  handleEmptyHistory(action: string = "") {
    const dataString = localStorage.getItem("cardsInfo");
    const localCardsData: {
      cardSide: string;
      cardID: string;
      cardJSON: JSON;
    }[] = JSON.parse(dataString!);

    const canvasObjects = this.canvas && this.canvas.getObjects();

    if (
      canvasObjects &&
      canvasObjects.length <= 11 &&
      action === "add" &&
      !this.loading.value &&
      this.emptyJSON
    ) {
      this.cardHistory.value.push({
        cardSide: this.cardSide,
        activeObject: null,
        json: JSON.parse(this.emptyJSON),
      });

      if (this.currentActionIndex.value === 0) {
        const historyHighestIndex = this.cardHistory.value.length - 1;

        const historyCopy = [...this.cardHistory.value];
        const slicedHistory = historyCopy.slice(historyHighestIndex);

        this.cardHistory.value = slicedHistory;
      }

      this.currentActionIndex.value += 1;
    } else if (
      this.cardHistory.value &&
      !this.loading.value &&
      canvasObjects &&
      canvasObjects.length >= 11 &&
      localCardsData
    ) {
      const empty = this.cardHistory.value.some(
        (obj) => obj.cardSide === this.cardSide
      );

      if (empty === false) {
        this.cardHistory.value.push({
          cardSide: this.cardSide,
          activeObject: null,
          json: JSON.parse(
            this.cardSide === "Front" ? emptyJsonFront : emptyJsonBack
          ),
        });
        this.currentActionIndex.value += 1;
      }
    }
  }

  refreshThumbnails() {
    if (this.cardSide === "Front" && this.canvas) {
      this.frontThumbnail.value = this.canvas.toDataURL();
    } else {
      if (this.canvas) this.backThumbnail.value = this.canvas.toDataURL();
    }
  }

  saveState(activeObject: CustomLineOptions, action: string = "") {
    const dataString = localStorage.getItem("cardsInfo");
    const localCardsData: {
      cardSide: string;
      cardID: string;
      cardJSON: JSON;
    }[] = JSON.parse(dataString!);

    const currHistory = this.cardHistory.value[this.currentActionIndex.value];

    const currentHistoryObject =
      currHistory &&
      this.cardHistory.value[this.currentActionIndex.value].activeObject;

    if (this.canvas && !this.loading.value) {
      if (this.currentActionIndex.value < this.cardHistory.value.length - 1) {
        this.cardHistory.value = this.cardHistory.value.slice(
          0,
          this.currentActionIndex.value <= 1 &&
            currentHistoryObject &&
            activeObject.lineType !== "perforation"
            ? this.currentActionIndex.value
            : this.currentActionIndex.value + 1
        );

        if (this.currentActionIndex.value === 1) {
          this.currentActionIndex.value = 0;
        }
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
            ? this.cardsData.value[0]
            : this.cardsData.value[1];

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

        this.currentActionIndex.value += 1;
      }

      this.refreshThumbnails();

      if (this.currentActionIndex.value >= this.cardHistory.value.length - 1) {
        this.currentActionIndex.value = this.cardHistory.value.length - 1;
      } else {
        this.currentActionIndex.value += 1;
      }

      const otherSide = this.cardSide === "Front" ? "Back" : "Front";

      const otherSideList: number[] = [];

      this.cardHistory.value.map((card, index) => {
        if (card.cardSide === otherSide) {
          otherSideList.push(index);
        }
      });

      if (
        otherSideList.length === 1 &&
        action === "modified" &&
        localCardsData
      ) {
        const otherSideJson =
          otherSide === "Front" ? emptyJsonFront : emptyJsonBack;

        const emptyHistory = {
          cardSide: otherSide,
          activeObject: null,
          json: JSON.parse(otherSideJson),
        };

        this.cardHistory.value.splice(
          this.cardHistory.value.length - 1,
          0,
          emptyHistory
        );

        this.currentActionIndex.value += 1;
      }

      if (this.cardHistory.value.length > 50) {
        this.cardHistory.value.shift();
      }
    }
  }

  renderCanvas() {
    if (this.canvas) this.canvas.requestRenderAll();
  }
}

export default Card;
