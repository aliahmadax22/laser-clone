import type {FabricObject, Canvas } from 'fabric';
export class DeleteObjectHelper {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.init();
  }

  private init() {
    // Use arrow function to retain the correct `this` context
    document.addEventListener("keyup", (e) => {
      if (e.key === "Delete") {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
          this.deleteObject(activeObject);
        }
      }
    });
  }

  public deleteObject = (activeObject: FabricObject) => {
    this.canvas.remove(activeObject);
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  };

  

}


export default DeleteObjectHelper;
