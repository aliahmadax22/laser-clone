import { Line } from "fabric";

export default class CustomBleedLine extends Line {
  addBleedLines(
    canvasWidth: number,
    canvasHeight: number,
    bleedMarginInPixels: number
  ) {
    const topLine = new Line(
      [
        bleedMarginInPixels,
        bleedMarginInPixels,
        canvasWidth - bleedMarginInPixels,
        bleedMarginInPixels,
      ],
      {
        id: "top-line",
        lineType: "bleedline",
        stroke: "blue",
        strokeDashArray: [40, 40],
        strokeWidth: 4,
        layout: true,
        selectable: false,
      }
    );

    const leftLine = new Line(
      [
        bleedMarginInPixels,
        bleedMarginInPixels,
        bleedMarginInPixels,
        canvasHeight - bleedMarginInPixels,
      ],
      {
        id: "left-line",
        lineType: "bleedline",
        stroke: "blue",
        strokeDashArray: [40, 40],
        strokeWidth: 4,
        layout: true,
        selectable: false,
      }
    );

    const rightLine = new Line(
      [
        canvasWidth - bleedMarginInPixels,
        bleedMarginInPixels,
        canvasWidth - bleedMarginInPixels,
        canvasHeight - bleedMarginInPixels,
      ],
      {
        id: "right-line",
        lineType: "bleedline",
        stroke: "blue",
        strokeDashArray: [40, 40],
        strokeWidth: 4,
        layout: true,
        selectable: false,
      }
    );

    const bottomLine = new Line(
      [
        bleedMarginInPixels,
        canvasHeight - bleedMarginInPixels,
        canvasWidth - bleedMarginInPixels,
        canvasHeight - bleedMarginInPixels,
      ],
      {
        id: "bottom-line",
        lineType: "bleedline",
        stroke: "blue",
        strokeDashArray: [40, 40],
        strokeWidth: 4,
        layout: true,
        selectable: false,
      }
    );

    return [topLine, rightLine, bottomLine, leftLine];
  }
}
