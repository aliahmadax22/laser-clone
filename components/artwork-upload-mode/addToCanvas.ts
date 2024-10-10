import type { Canvas, FabricObject } from "fabric";
import type Page from "./helpers/Pages";

interface inlinePage {
  pageNumber?: number;
  page?: Page;
}

export const addToCanvas = (
  object: FabricObject,
  activeCanvas: inlinePage | null = null,
  canvas: Canvas | null = null,
  inlinePages: inlinePage[],
  modeType: string
) => {
  if (object && modeType === "page") {
    if (
      (activeCanvas && activeCanvas.pageNumber === 1) ||
      (activeCanvas &&
        activeCanvas.pageNumber !== 2 &&
        activeCanvas.pageNumber === inlinePages.length)
    ) {
      console.log("Object addition prevented.");
    } else {
      canvas && canvas.add(object);
      object.setCoords();
      canvas && canvas.requestRenderAll();
    }
  } else if (object && canvas) {
    canvas.add(object);
    object.setCoords();
    canvas.requestRenderAll();
  }
};
