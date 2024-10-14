import type { FabricObject } from "fabric";
export class ModifyObjectHelper {
  scaleToFit(activeObject: FabricObject, cWidth: number, cHeight: number) {
    if (activeObject) {
      const canvasWidth = cWidth;
      const canvasHeight = cHeight;

      if (
        activeObject &&
        activeObject.type !== "textbox" &&
        (activeObject.angle === 270 || activeObject.angle === 90)
      ) {
        activeObject.scaleToWidth(canvasWidth);
      } else if (
        activeObject &&
        activeObject.type !== "textbox" &&
        (activeObject.angle === 0 || activeObject.angle === 360)
      ) {
        activeObject.scaleToHeight(canvasHeight);
      } else if (
        activeObject &&
        activeObject.type === "textbox" &&
        (activeObject.angle === 270 || activeObject.angle === 90)
      ) {
        activeObject.scaleToHeight(canvasHeight);
      } else {
        activeObject.scaleToWidth(canvasWidth);
      }

      activeObject.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: "center",
        originY: "center",
      });

      // Apply the changes and refresh the canvas
      activeObject.setCoords();
      activeObject.setControlsVisibility({
        ml: false, // Middle left
        mb: false, // Middle bottom
        mt: false, // Middle top
        mr: false, // Middle right
      });
    }
  }

  scaleToCover(activeObject: FabricObject, cWidth: number, cHeight: number) {
    if (activeObject) {
      const canvasWidth = cWidth;
      const canvasHeight = cHeight;
      let scaleX, scaleY;

      // Check the current angle of the image
      const currentAngle = activeObject.angle % 360;

      // Adjust scaleX and scaleY based on the image's current angle
      if (currentAngle === 90 || currentAngle === 270) {
        scaleX = canvasWidth / activeObject.height;
        scaleY = canvasHeight / activeObject.width;
      } else {
        scaleX = canvasWidth / activeObject.width;
        scaleY = canvasHeight / activeObject.height;
      }

      const scale = Math.max(scaleX, scaleY);

      activeObject.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
      });

      // Apply the changes and refresh the canvas
      activeObject.setCoords(); // Ensure the object's bounding box is updated
    }
  }

  rotateCW(activeObject: FabricObject) {
    if (activeObject) {
      const angle = 90;
      this.rotateIt(activeObject, angle);
    }
  }

  rotateACW(activeObject: FabricObject) {
    if (activeObject) {
      const angle = -90;
      this.rotateIt(activeObject, angle);
    }
  }

  rotateIt(activeObject: FabricObject, angle: number) {
    // Calculate the new angle
    let newAngle = Math.round(activeObject.angle / 90) * 90 + angle;

    // Ensure the angle is within 0-360 degrees
    newAngle = (newAngle + 360) % 360;

    activeObject.set({
      angle: newAngle,
      originX: "center",
      originY: "center",
    });

    activeObject.setCoords();
  }

  changeColor(activeObject: FabricObject, color: string) {
    activeObject.set({
      fill: color,
    });
  }
}

export default ModifyObjectHelper;
