import type { Canvas, FabricObject, TOriginX, TOriginY } from "fabric";

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

export const bringBleedlinesToFront = (canvas: Canvas) => {
  canvas?.getObjects().map((obj) => {
    const object = obj as CustomLineOptions;

    if (object?.lineType === "bleedline") {
      canvas.bringObjectToFront(object);
      canvas.requestRenderAll();
    }
  });
};

export const toggleBleedlines = (canvas: Canvas, showLines: boolean) => {
  canvas?.getObjects().map((obj) => {
    const object = obj as CustomLineOptions;

    if (object?.lineType === "bleedline") {
      object.set({
        opacity: showLines === true ? 1 : 0,
      });
      canvas.requestRenderAll();
    }
  });
};
