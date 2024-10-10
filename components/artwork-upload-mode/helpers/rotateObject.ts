import type {FabricObject, Canvas } from 'fabric';
export class RotateObjectHelper {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }


  public rotateCW(activeObject: FabricObject) {
    if (activeObject) {
      const angle = 90;
      this.rotateIt(activeObject, angle);
    }
  }

  public rotateACW(activeObject: FabricObject) {
    if (activeObject) {
      const angle = -90;
      this.rotateIt(activeObject, angle);
    }
  }

  private rotateIt(activeObject: FabricObject, angle: number){
    // Calculate the new angle
    let newAngle = Math.round(activeObject.angle / 90) * 90 + angle;

    // Ensure the angle is within 0-360 degrees
    newAngle = (newAngle + 360) % 360;

    activeObject.set({
      angle: newAngle,
      originX: 'center',
      originY: 'center',
    });

    // Apply the changes and refresh the canvas
    activeObject.setCoords(); // Ensure the object's bounding box is updated
    this.canvas.renderAll();
  }
}

export default RotateObjectHelper;
