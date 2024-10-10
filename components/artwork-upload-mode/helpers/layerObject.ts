import type { FabricObject, Canvas } from "fabric";
export class LayerObjectHelper {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  public sendToBack = (activeObject: FabricObject) => {
    this.canvas.sendObjectToBack(activeObject);
    this.canvas.renderAll();
  };

  public bringToFront = (activeObject: FabricObject) => {
    this.canvas.bringObjectToFront(activeObject);
    this.canvas.renderAll();
  };

  public sendBackwards = (activeObject: FabricObject) => {
    this.canvas.sendObjectBackwards(activeObject);
    this.canvas.renderAll();
  };

  public bringForward = (activeObject: FabricObject) => {
    this.canvas.bringObjectForward(activeObject);
    this.canvas.renderAll();
  };
}

export default LayerObjectHelper;
