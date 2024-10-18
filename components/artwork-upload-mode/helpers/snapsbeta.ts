import { type Canvas, type FabricObject, Line } from "fabric";

class SnaplinesBeta {
  canvas: Canvas;
  snapTolerance: number;
  horizontalCenterLine: Line;
  verticalCenterLine: Line;
  topLine: Line;
  bottomLine: Line;
  leftLine: Line;
  rightLine: Line;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.snapTolerance = 3; // Pixels within which snaplines appear
    const zoom = this.canvas.getZoom();

    // Create the snaplines (invisible by default)
    this.horizontalCenterLine = new Line(
      [
        0,
        this.canvas.height / 2 / zoom,
        this.canvas.width / zoom,
        this.canvas.height / 2 / zoom,
      ],
      {
        stroke: "red",
        lineType: "snap",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        visible: false,
      }
    );

    this.verticalCenterLine = new Line(
      [
        this.canvas.width / 2 / zoom,
        0,
        this.canvas.width / 2 / zoom,
        this.canvas.height / zoom,
      ],
      {
        stroke: "red",
        lineType: "snap",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        visible: false,
      }
    );

    this.topLine = new Line([0, 0, this.canvas.width! / zoom, 0], {
      stroke: "red",
      lineType: "snap",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
    });

    this.bottomLine = new Line(
      [
        0,
        this.canvas.height! / zoom,
        this.canvas.width! / zoom,
        this.canvas.height! / zoom,
      ],
      {
        stroke: "red",
        lineType: "snap",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        visible: false,
      }
    );

    this.leftLine = new Line([0, 0, 0, this.canvas.height! / zoom], {
      stroke: "red",
      lineType: "snap",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      visible: false,
    });

    this.rightLine = new Line(
      [canvas.width! / zoom, 0, canvas.width! / zoom, canvas.height! / zoom],
      {
        stroke: "red",
        lineType: "snap",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        visible: false,
      }
    );

    // Add lines to the canvas
    canvas.add(
      this.horizontalCenterLine,
      this.verticalCenterLine,
      this.topLine,
      this.bottomLine,
      this.leftLine,
      this.rightLine
    );

    // Register the event listener for object movement
    this.registerListeners();
  }

  // Register js object:moving event listener
  registerListeners() {
    this.canvas.on("object:moving", (e) => {
      this.updateSnaplines(e.target as FabricObject);
    });

    this.canvas.on("object:modified", () => {
      this.hideSnaplines();
    });
  }

  // Show or hide the snaplines based on object position
  updateSnaplines(object: FabricObject) {
    const zoom = this.canvas.getZoom();
    const canvasCenterX = this.canvas.width / 2 / zoom;
    const canvasCenterY = this.canvas.height / 2 / zoom;

    // const objectCenterX = object.left! + object.width! / 2;

    const objectCenterX =
      object.type !== "image" && object.type !== "group"
        ? object.left
        : (object.width * object.scaleX) / 2 + object.left;

    // const objectCenterY = object.top! + object.height! / 2

    const objectCenterY =
      object.type !== "image" && object.type !== "group"
        ? object.top
        : (object.height * object.scaleY) / 2 + object.top;

    const objectTop = Math.abs(
      object.type !== "textbox"
        ? object.top * object.scaleY
        : object.top - (object.height * object.scaleY) / 2
    );

    const objectBottom = Math.abs(
      object.type !== "textbox"
        ? object.top + object.height * object.scaleY - this.canvas.height / zoom
        : object.top +
            (object.height * object.scaleY) / 2 -
            this.canvas.height / zoom
    );

    const objectLeft = Math.abs(
      object.type !== "textbox"
        ? object.left * object.scaleX
        : object.left - (object.width * object.scaleX) / 2
    );

    const objectRight = Math.abs(
      object.type !== "textbox"
        ? object.left + object.width * object.scaleX - this.canvas.width / zoom
        : object.left +
            (object.width * object.scaleX) / 2 -
            this.canvas.width / zoom
    );

    const actualHeight = this.canvas.height / zoom;
    const actualWidth = this.canvas.width / zoom;

    // Show horizontal center line if object is close to horizontal center
    this.horizontalCenterLine.set({
      visible:
        Math.abs(objectCenterY - canvasCenterY) < this.snapTolerance
          ? true
          : false,
    });

    if (
      objectCenterY > canvasCenterY - this.snapTolerance &&
      objectCenterY < canvasCenterY + this.snapTolerance
    ) {
      object.set({
        top:
          object.type !== "image" && object.type !== "group"
            ? canvasCenterY
            : canvasCenterY - (object.height * object.scaleY) / 2,
      });
    }

    // Show vertical center line if object is close to vertical center
    this.verticalCenterLine.set(
      "visible",
      Math.abs(objectCenterX - canvasCenterX) < this.snapTolerance
    );

    if (
      objectCenterX > canvasCenterX - this.snapTolerance &&
      objectCenterX < canvasCenterX + this.snapTolerance
    ) {
      object.set({
        left:
          object.type !== "image" && object.type !== "group"
            ? canvasCenterX
            : canvasCenterX - (object.width * object.scaleX) / 2,
      });
    }

    // Show top line if object is close to the top
    this.topLine.set(
      "visible",
      objectTop > 0 - this.snapTolerance && objectTop < 0 + this.snapTolerance
    );

    if (
      objectTop > 0 - this.snapTolerance &&
      objectTop < 0 + this.snapTolerance
    ) {
      object.set({
        top: Math.abs(object.type !== "textbox" ? 0 : 0 + object.height / 2),
      });
    }

    // Show bottom line if object is close to the bottom
    this.bottomLine.set("visible", objectBottom < this.snapTolerance);

    if (objectBottom < this.snapTolerance) {
      object.set({
        top:
          actualHeight -
          (object.type !== "textbox"
            ? object.height * object.scaleY
            : (object.height / 2) * object.scaleY),
      });
    }

    // Show left line if object is close to the left edge
    this.leftLine.set(
      "visible",
      Math.abs(
        object.type !== "textbox"
          ? object.left * object.scaleX
          : object.left - (object.width * object.scaleX) / 2
      ) < this.snapTolerance
    );

    if (
      objectLeft > 0 - this.snapTolerance &&
      objectLeft < 0 + this.snapTolerance
    ) {
      object.set({
        left: Math.abs(object.type !== "textbox" ? 0 : 0 + object.width / 2),
      });
    }

    // Show right line if object is close to the right edge
    this.rightLine.set(
      "visible",
      Math.abs(
        object.type !== "textbox"
          ? object.left +
              object.width * object.scaleX -
              this.canvas.width / zoom
          : object.left +
              (object.width * object.scaleX) / 2 -
              this.canvas.width / zoom
      ) < this.snapTolerance
    );

    if (objectRight < this.snapTolerance) {
      object.set({
        left:
          actualWidth -
          (object.type !== "textbox"
            ? object.width * object.scaleX
            : (object.width / 2) * object.scaleX),
      });
    }

    // Render canvas to reflect changes
    this.canvas.renderAll();
  }

  hideSnaplines() {
    this.horizontalCenterLine.set("visible", false);
    this.verticalCenterLine.set("visible", false);
    this.topLine.set("visible", false);
    this.bottomLine.set("visible", false);
    this.leftLine.set("visible", false);
    this.rightLine.set("visible", false);

    // Re-render the canvas to update the visibility
    this.canvas.renderAll();
  }
}

export default SnaplinesBeta;
