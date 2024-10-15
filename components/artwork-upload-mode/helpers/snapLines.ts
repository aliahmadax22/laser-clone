import { Line } from "fabric";
import FabricHelper from "./fabricHelper.js";
import type { BasicTransformEvent, Canvas, FabricObject } from "fabric";

interface FabricObjectEvent extends BasicTransformEvent {
  target: FabricObject;
}
export class SnapLinesHelper {
  private canvas: Canvas;
  private fabricHelper?: FabricHelper;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.init();
  }

  private init() {
    this.fabricHelper = new FabricHelper(this.canvas);
    this.declareLines();
    this.canvas.on("object:moving", this.showSnapLines.bind(this));
  }

  private declareLines() {
    const color = "rgb(178, 207, 255)";

    //Vertical line Center
    const verticalLineCenter = new Line(
      [this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.width],
      {
        id: "vertical-line-center",
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 1,
        strokeWidth: 0.5,
        visible: false,
      }
    );

    verticalLineCenter.selectable = false;
    verticalLineCenter.evented = false;
    this.canvas.add(verticalLineCenter);

    //Horizontal Line Center
    const horizontalLineCenter = new Line(
      [0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2],
      {
        id: "horizontal-line-center",
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 1,
        strokeWidth: 0.5,
        visible: false,
      }
    );

    horizontalLineCenter.selectable = false;
    horizontalLineCenter.evented = false;

    this.canvas.add(horizontalLineCenter);

    //Horizontal Line Top
    const horizontalLineTop = new Line([0, 0, this.canvas.width, 0], {
      id: "horizontal-line-top",
      evented: true,
      stroke: color,
      selectable: false,
      opacity: 1,
      strokeWidth: 0.1,
    });

    horizontalLineTop.selectable = false;
    horizontalLineTop.evented = false;

    //Horizontal Line Bottom
    const horizontalLineBottom = new Line(
      [0, this.canvas.height, this.canvas.width, this.canvas.height],
      {
        id: "horizontal-line-bottom",
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 1,
        strokeWidth: 0.1,
      }
    );

    horizontalLineBottom.selectable = false;
    horizontalLineBottom.evented = false;

    //Vertical Line Left
    const verticalLineLeft = new Line([0, 0, 0, this.canvas.height], {
      id: "vertical-line-left",
      evented: true,
      stroke: color,
      selectable: false,
      opacity: 1,
      strokeWidth: 0.1,
    });

    verticalLineLeft.selectable = false;
    verticalLineLeft.evented = false;

    //Vertical Line Right
    const verticalLineRight = new Line(
      [this.canvas.width, 0, this.canvas.width, this.canvas.height],
      {
        id: "vertical-line-right",
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 1,
        strokeWidth: 0.1,
      }
    );

    verticalLineRight.selectable = false;
    verticalLineRight.evented = false;
  }

  private showSnapLines(options: FabricObjectEvent) {
    const snapZone = 10;
    const zoom = this.canvas.getZoom();

    if (options.e.ctrlKey) {
      // If Ctrl is pressed, do not snap
      return;
    }

    if (options.target.angle != 0) {
      //If Angle is different of 0 don't snap to bounderies...Was hard to rework the logic so for now is just stopped
      return;
    }

    //Horizontal Snap Center
    const objectMiddleHorizontal = options.target.left;
    if (this.fabricHelper) {
      const verticalLineCenter = this.fabricHelper.findObjectById(
        "vertical-line-center"
      );
      if (verticalLineCenter) {
        if (
          objectMiddleHorizontal > this.canvas.width / 2 / zoom - snapZone &&
          objectMiddleHorizontal < this.canvas.width / 2 / zoom + snapZone
        ) {
          options.target
            .set({
              left: this.canvas.width / 2 / zoom,
              originX: "center",
            })
            .setCoords();
          verticalLineCenter.set("visible", true);

          this.canvas.bringObjectToFront(verticalLineCenter);

          document.addEventListener("mouseup", () => {
            if (verticalLineCenter) {
              verticalLineCenter.set("visible", false);
            }
          });
        } else {
          verticalLineCenter.set("visible", false);
        }
      }
    }

    //Vertical Snap Center
    const objectMiddleVertical = options.target.top;
    if (this.fabricHelper) {
      const horizontalLineCenter = this.fabricHelper.findObjectById(
        "horizontal-line-center"
      );
      if (horizontalLineCenter) {
        if (
          objectMiddleVertical > this.canvas.height / 2 / zoom - snapZone &&
          objectMiddleVertical < this.canvas.height / 2 / zoom + snapZone
        ) {
          options.target
            .set({
              top: this.canvas.height / 2 / zoom,
              originY: "center",
            })
            .setCoords();

          horizontalLineCenter.set("visible", true);

          this.canvas.bringObjectToFront(horizontalLineCenter);

          document.addEventListener("mouseup", () => {
            if (horizontalLineCenter) {
              horizontalLineCenter.set("visible", false);
            }
          });
        } else {
          horizontalLineCenter.set("visible", false);
        }
      }
    }

    const objectTopCoord = options.target.getScaledHeight() / 2 - 1;
    const objectLeftCoord = options.target.getScaledWidth() / 2 - 1;
    const objectTopVertical = options.target.top - objectTopCoord;
    const objectBotVertical = options.target.top + objectTopCoord;
    const objectLeftHorizontal = options.target.left - objectLeftCoord;
    const objectRightHorizontal = options.target.left + objectLeftCoord;

    //Top Snap
    if (objectTopVertical > 0 - snapZone && objectTopVertical < 0 + snapZone) {
      options.target
        .set({
          top: 0 + objectTopCoord,
          originY: "center",
        })
        .setCoords();
    }

    //Bottom Snap
    const actualHeight = this.canvas.height / zoom;

    if (
      objectBotVertical > actualHeight - snapZone &&
      objectBotVertical < actualHeight + snapZone
    ) {
      options.target
        .set({
          top: actualHeight - objectTopCoord,
          originY: "center",
        })
        .setCoords();
    }

    //Left Snap
    if (
      objectLeftHorizontal > 0 - snapZone &&
      objectLeftHorizontal < 0 + snapZone
    ) {
      options.target
        .set({
          left: 0 + objectLeftCoord,
          originX: "center",
        })
        .setCoords();
    }

    const actualWidth = this.canvas.width / zoom;

    //Right Snap
    if (
      objectRightHorizontal > actualWidth - snapZone &&
      objectRightHorizontal < actualWidth + snapZone
    ) {
      options.target
        .set({
          left: actualWidth - objectLeftCoord,
          originX: "center",
        })
        .setCoords();
    }
  }
}

export default SnapLinesHelper;
