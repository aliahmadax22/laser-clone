/* eslint-disable import/no-mutable-exports */
import { Canvas, FabricImage, Rect } from "fabric";
import type { FabricObject, TFiller, TOriginX, TOriginY } from "fabric";
import CustomBleedLine from "./customBleedLines";
import { ref } from "vue";
import type { Sides } from "./SidesManager.js";
import _ from "lodash";

let history: JSON[] = [];
let currentActionIndex: number = -1;

let fabricCanvas: Canvas | null = null;
let bleedLinesHandler: CustomBleedLine;
let frame: FabricImage | null = null;

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
  originX: TOriginX;
  originY: TOriginY;
  strokeWidth: number;
  layout?: boolean;
  padding: number;
}

interface inlinePage {
  pageNumber?: number;
  pageID: string;
  canvas: Canvas;
}

interface customObj {
  side?: string;
  type?: string;
  left?: number;
  top?: number;
  width?: number;
  fontSize?: number;
  fill?: string;
  editable?: boolean;
  fontFamily?: string;
  originX?: string;
  originY?: string;
  textAlign?: string;
  angle?: number;
  clipPath?: object | FabricObject | null;
  value?: FabricObject;
}

interface prodInfo {
  bleed_mm: number;
  dpi: number;
  height_mm: number;
  height_px: number;
  sides: number;
  width_mm: number;
  width_px: number;
}

interface canvasDimensions {
  width: number;
  height: number;
}

let bleedMarginInPixels: number;

const modeTypeRef = ref("card");
const pageSideRef = ref("left");
const currentCardSideRef = ref<string | null>("Front");
const cardRef = ref<Sides[]>([]);
const activeObjectRef = ref<FabricObject | null | undefined>(null);

const objAddedRef = ref<FabricObject | null>(null);

const currentCanvasRef = ref<inlinePage[] | null>(null);
const canvasDimensionsRef = ref<canvasDimensions | null>(null);

const isLoadingFromJSONRef = ref<boolean>(false);

const debounceSaveState = _.debounce(() => {
  saveState();
}, 300);

const initializeCanvas = (
  canvasRef: HTMLCanvasElement,
  productInfo: prodInfo
) => {
  const widthInInches = productInfo.width_mm / 25.4;
  const heightInInches = productInfo.height_mm / 25.4;

  const widthInPixels = widthInInches * productInfo.dpi;
  const heightInPixels = heightInInches * productInfo.dpi;

  // const containerWidth = widthInPixels;
  // const scale = Math.min(containerWidth / widthInPixels, 1);
  const canvasWidth = widthInPixels;
  const canvasHeight = heightInPixels;
  bleedMarginInPixels = (productInfo.bleed_mm / 25.4) * productInfo.dpi;

  fabricCanvas = new Canvas(canvasRef, {
    width: canvasWidth * 2,
    height: canvasHeight,
    selection: false,
    preserveObjectStacking: true,
    controlsAboveOverlay: true,
    fill: "white",
    stroke: "black",
    selectable: false,
  });

  canvasDimensionsRef.value = { width: canvasWidth * 2, height: canvasHeight };

  FabricImage.fromURL("https://i.ibb.co/Tt8HjkR/frame.png").then(
    (loadedImg) => {
      if (fabricCanvas) {
        frame = loadedImg;

        frame.set({
          id: "frame",
          selectable: false,
          hasControls: false,
        });

        frame.scaleToWidth(fabricCanvas.width);
        frame.scaleToHeight(fabricCanvas.height);
        frame.setCoords();
        fabricCanvas.renderAll();
      }
    }
  );

  fabricCanvas.on("mouse:down", (e) => {
    if (modeTypeRef.value === "card") activeObjectRef.value = e.target;
  });

  fabricCanvas.on("mouse:up", (e) => {
    if (modeTypeRef.value === "cover") {
      const pointer = fabricCanvas?.getViewportPoint(e.e);
      const midX = fabricCanvas && fabricCanvas.width / 2;
      if (pointer && midX) {
        pageSideRef.value =
          pointer.x <= midX - 40
            ? "left"
            : pointer.x >= midX + 39
            ? "right"
            : "middle";
      }
    }
  });

  const initRect = new Rect({
    side: "right",
    left: fabricCanvas.width / 2,
    top: fabricCanvas.height / 2,
    height: 100,
    width: 100,
    fill: "#faa",
    originX: "center",
    originY: "center",
    centeredRotation: true,
  });

  fabricCanvas.add(initRect);

  // const midX = canvasWidth / 2;

  fabricCanvas.on("object:added", (e) => {
    if (modeTypeRef.value !== "page") {
      if (isLoadingFromJSONRef.value === false) {
        debounceSaveState();
      }
      const obj: CustomLineOptions = e.target;

      if (fabricCanvas) {
        fabricCanvas.getObjects().forEach((object) => {
          if (object.id === "frame" && fabricCanvas) {
            fabricCanvas.bringObjectToFront(object);
            fabricCanvas.requestRenderAll();
          }
        });
      }

      if (
        fabricCanvas &&
        obj.type !== "line" &&
        modeTypeRef.value === "cover" &&
        objAddedRef
      ) {
        objAddedRef.value = obj;

        obj.set({
          side: pageSideRef.value,
        });
        fabricCanvas.requestRenderAll();
      }
    }
  });

  fabricCanvas.on("object:modified", () => {
    if (modeTypeRef.value === "cover") {
      if (!isLoadingFromJSONRef.value) {
        debounceSaveState();
      }
    }
  });

  fabricCanvas.on("object:removed", () => {
    if (modeTypeRef.value === "cover") {
      if (!isLoadingFromJSONRef.value) {
        debounceSaveState();
      }
    }
  });

  const zoom = fabricCanvas.getZoom();
  const midX = fabricCanvas.width / 2 / zoom;

  fabricCanvas.on("object:moving", (e) => {
    const customObj = e.target as customObj;
    if (e.target.type !== "line" && modeTypeRef.value === "cover") {
      if (customObj.side === "right") {
        customObj.clipPath = new Rect({
          left: midX + 40,
          top: 0,
          width: midX + 40,
          height: canvasHeight,
          absolutePositioned: true,
        });
      } else if (customObj.side === "left") {
        customObj.clipPath = new Rect({
          left: 0,
          top: 0,
          width: midX - 40,
          height: canvasHeight,
          absolutePositioned: true,
        });
      } else {
        if (fabricCanvas) {
          const stripWidth = 80;
          customObj.clipPath = new Rect({
            left: midX - stripWidth / 2,
            top: 0,
            width: stripWidth,
            height: canvasHeight,
            absolutePositioned: true,
          });
        }
      }
    }
    fabricCanvas && fabricCanvas.renderAll();
  });

  bleedLinesHandler = new CustomBleedLine();

  const lines = bleedLinesHandler.addBleedLines(
    fabricCanvas.width,
    fabricCanvas.height,
    bleedMarginInPixels
  );

  lines?.map((line) => {
    fabricCanvas && fabricCanvas.add(line);
    fabricCanvas && fabricCanvas.bringObjectToFront(line);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Delete" && fabricCanvas) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.remove(activeObject);
        fabricCanvas.renderAll();
      }
    }
  });

  return {
    fabricCanvas,
  };
};

const setModeType = (newModeType: string) => {
  modeTypeRef.value = newModeType;
};

const saveState = () => {
  if (fabricCanvas && !isLoadingFromJSONRef.value) {
    const canvasState = fabricCanvas.toObject();

    if (currentActionIndex < history.length - 1) {
      history = history.slice(0, currentActionIndex + 1);
    }

    history.push(canvasState);

    currentActionIndex++;

    if (history.length > 50) {
      history.shift();
    }
  }
};

const loadCanvasFromJSON = async (json: JSON) => {
  if (fabricCanvas) {
    isLoadingFromJSONRef.value = true;
    const jsonToLoad = json;

    await fabricCanvas.loadFromJSON(jsonToLoad).then(() => {
      fabricCanvas && fabricCanvas.requestRenderAll();
      isLoadingFromJSONRef.value = false;
    });
  }
};

const undo = () => {
  if (fabricCanvas && currentActionIndex > 0) {
    currentActionIndex--;
    loadCanvasFromJSON(history[currentActionIndex]);
  } else {
    // NO PREVIOUS STATE
  }
};

const redo = async () => {
  if (fabricCanvas && currentActionIndex < history.length - 1) {
    currentActionIndex++;
    await loadCanvasFromJSON(history[currentActionIndex]);
  }
};

export {
  initializeCanvas,
  fabricCanvas,
  activeObjectRef,
  setModeType,
  undo,
  redo,
  cardRef,
  pageSideRef,
  currentCardSideRef,
  objAddedRef,
  bleedMarginInPixels,
  frame,
  currentCanvasRef,
  canvasDimensionsRef,
  isLoadingFromJSONRef,
};
