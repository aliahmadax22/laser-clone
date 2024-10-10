import type {FabricObject, Canvas } from 'fabric';
export class ScaleObjectHelper {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }


  public scaleToFit(activeObject: FabricObject) {
    if (activeObject) {

      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;
      activeObject.scaleToWidth(canvasWidth);
      activeObject.scaleToHeight(canvasHeight);

      activeObject.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center'
      });

      // Apply the changes and refresh the canvas
      activeObject.setCoords(); // Ensure the object's bounding box is updated
      activeObject.setControlsVisibility({
        ml: false, // Middle left
        mb: false, // Middle bottom
        mt: false, // Middle top
        mr: false  // Middle right
      });
      this.canvas.renderAll();
    }
  }
  public scaleToCover(activeObject: FabricObject) {
    if (activeObject) {

      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;
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
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale
      });

      // Apply the changes and refresh the canvas
      activeObject.setCoords(); // Ensure the object's bounding box is updated
      this.canvas.renderAll();
    }
  }


}


export default ScaleObjectHelper;
