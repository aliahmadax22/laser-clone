import type { FabricObject, TFiller, TOriginX, TOriginY } from "fabric";

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

export class Sides {
  canvasObjects: CustomLineOptions[];
  id: string;
  canvasSide: string;
  thumbnail: string;

  constructor(
    sideID: string,
    canvasObjects: CustomLineOptions[],
    canvasSide: string,
    thumbnail: string
  ) {
    this.canvasObjects = canvasObjects;
    this.id = sideID;
    this.canvasSide = canvasSide;
    this.thumbnail = thumbnail;
  }

  setSideObjects(canvasObjects: CustomLineOptions[]) {
    this.canvasObjects = canvasObjects;
  }

  getSideObjects = (): CustomLineOptions[] => {
    return this.canvasObjects;
  };
}
