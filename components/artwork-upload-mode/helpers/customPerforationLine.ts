import type { Canvas, TFiller, TOriginX, TOriginY } from "fabric";
import { Line } from "fabric";
import { v4 as uuid } from "uuid";

interface CustomLineOptions {
  linePosition?: string;
  lineType?: string;
  id: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  stroke: string | TFiller | null;
  left?: number;
  top?: number;
  strokeDashArray: number[];
  selectable: boolean;
  evented: boolean;
  originX: TOriginX;
  originY: TOriginY;
  opacity: number;
  strokeWidth: number;
  layout?: boolean;
  padding: number;
}

export default class CustomLine extends Line {
  linePosition: string;
  lineType: string;
  options: CustomLineOptions;

  constructor(canvas: Canvas, linePosition: string) {
    const zoom = canvas.getZoom();

    const options: CustomLineOptions = {
      x1: linePosition === "horizontal" ? 0 : canvas.width / 2 / zoom,
      y1: linePosition === "horizontal" ? canvas.height / 2 / zoom : 0,
      x2:
        linePosition === "horizontal"
          ? canvas.width / zoom
          : canvas.width / 2 / zoom,
      y2:
        linePosition === "horizontal"
          ? canvas.height / 2 / zoom
          : canvas.height / zoom,
      linePosition: linePosition,
      id: uuid(),
      left: linePosition === "horizontal" ? canvas.width / 2 / zoom : 50,
      top: linePosition === "horizontal" ? 50 : canvas.height / 2 / zoom,
      lineType: "perforation",
      stroke: "#FF0000",
      strokeDashArray: [10, 10],
      selectable: true,
      evented: true,
      originX: "center",
      originY: "center",
      opacity: 1,
      strokeWidth: 3,
      layout: true,
      padding: 20,
    };
    super([options.x1!, options.y1!, options.x2!, options.y2!], options);
    this.linePosition = linePosition;
    this.lineType = options.lineType!;
    this.canvas = canvas;
    this.options = options;

    // this.mirrorAddition()
  }

  mirrorLine(canvas: Canvas): CustomLine {
    const mirroredLine = new CustomLine(canvas, this.linePosition);
    const zoom = canvas.getZoom();
    if (canvas) {
      mirroredLine.set({
        id: this.options.id,
        left: canvas.width / zoom - this.left!,
        top: canvas.height / zoom - this.top!,
      });
    }
    return mirroredLine;
  }

  straightLine(canvas: Canvas): CustomLine {
    const mirroredLine = new CustomLine(canvas, this.linePosition);
    if (canvas) {
      mirroredLine.set({
        id: this.options.id,
        left: this.left,
        top: this.top,
      });
    }
    return mirroredLine;
  }
}
