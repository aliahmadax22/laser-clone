import { Line, type Canvas } from "fabric";
import FabricHelper from "./fabricHelper";
export class BleedLinesHelper {
  private canvas: Canvas;
  private canvasWidth: number;
  private canvasHeight: number;
  private bleedMarginInPixels: number;
  private fabricHelper?: FabricHelper;

  constructor(
    canvas: Canvas,
    canvasWidth: number,
    canvasHeight: number,
    bleedMarginInPixels: number
  ) {
    this.canvas = canvas;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.bleedMarginInPixels = bleedMarginInPixels;
    this.init();
  }

  private init() {
    this.fabricHelper = new FabricHelper(this.canvas);
    this.declareLines();
    this.showBleedLines(); // Show the bleed lines when the class is initialized
  }

  private declareLines() {
    // Top horizontal line
    const topLine = new Line(
      [
        this.bleedMarginInPixels,
        this.bleedMarginInPixels,
        this.canvasWidth - this.bleedMarginInPixels,
        this.bleedMarginInPixels,
      ],
      {
        id: "top-line",
        stroke: "#FF0000",
        strokeDashArray: [5, 5],
        strokeWidth: 2,
        layout: true,
        selectable: false, // Make the line non-selectable
      }
    );
    this.canvas.add(topLine);

    // Left vertical line
    const leftLine = new Line(
      [
        this.bleedMarginInPixels,
        this.bleedMarginInPixels,
        this.bleedMarginInPixels,
        this.canvasHeight - this.bleedMarginInPixels,
      ],
      {
        id: "left-line",
        stroke: "#FF0000",
        strokeDashArray: [5, 5],
        strokeWidth: 2,
        layout: true,
        selectable: false, // Make the line non-selectable
      }
    );
    this.canvas.add(leftLine);

    // Right vertical line
    const rightLine = new Line(
      [
        this.canvasWidth - this.bleedMarginInPixels,
        this.bleedMarginInPixels,
        this.canvasWidth - this.bleedMarginInPixels,
        this.canvasHeight - this.bleedMarginInPixels,
      ],
      {
        id: "right-line",
        stroke: "#FF0000",
        strokeDashArray: [5, 5],
        strokeWidth: 2,
        layout: true,
        selectable: false, // Make the line non-selectable
      }
    );
    this.canvas.add(rightLine);

    // Bottom horizontal line
    const bottomLine = new Line(
      [
        this.bleedMarginInPixels,
        this.canvasHeight - this.bleedMarginInPixels,
        this.canvasWidth - this.bleedMarginInPixels,
        this.canvasHeight - this.bleedMarginInPixels,
      ],
      {
        id: "bottom-line",
        stroke: "#FF0000",
        strokeDashArray: [5, 5],
        strokeWidth: 2,
        layout: true,
        selectable: false, // Make the line non-selectable
      }
    );
    this.canvas.add(bottomLine);

    this.hideBleedLines(); // Hide them initially, they will be shown on mount
  }

  public showBleedLines() {
    if (this.fabricHelper) {
      this.fabricHelper.findObjectById("top-line")?.set("visible", true);
      this.fabricHelper.findObjectById("bottom-line")?.set("visible", true);
      this.fabricHelper.findObjectById("left-line")?.set("visible", true);
      this.fabricHelper.findObjectById("right-line")?.set("visible", true);
      this.canvas.renderAll();
    }
  }

  public hideBleedLines() {
    if (this.fabricHelper) {
      this.fabricHelper.findObjectById("top-line")?.set("visible", false);
      this.fabricHelper.findObjectById("bottom-line")?.set("visible", false);
      this.fabricHelper.findObjectById("left-line")?.set("visible", false);
      this.fabricHelper.findObjectById("right-line")?.set("visible", false);
      this.canvas.renderAll();
    }
  }

  public toggleBleedLines() {
    if (this.fabricHelper) {
      const isVisible = this.fabricHelper
        .findObjectById("top-line")
        ?.get("visible");
      if (isVisible) {
        this.hideBleedLines();
        this.canvas.fire("object:removed");
      } else {
        this.showBleedLines();
        this.canvas.fire("object:added");
      }
    }
  }

  public setBleedLinesAlwaysOnTop() {
    if (this.fabricHelper) {
      const topLine = this.fabricHelper.findObjectById("top-line");
      if (topLine) {
        this.canvas.bringObjectToFront(topLine);
      }
      const bottomLine = this.fabricHelper.findObjectById("bottom-line");
      if (bottomLine) {
        this.canvas.bringObjectToFront(bottomLine);
      }
      const leftLine = this.fabricHelper.findObjectById("left-line");
      if (leftLine) {
        this.canvas.bringObjectToFront(leftLine);
      }
      const rightLine = this.fabricHelper.findObjectById("right-line");
      if (rightLine) {
        this.canvas.bringObjectToFront(rightLine);
      }
    }
  }
}

export default BleedLinesHelper;
