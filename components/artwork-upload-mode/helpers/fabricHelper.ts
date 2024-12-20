import type { FabricObject, Canvas } from 'fabric';

declare module 'fabric' {
  export interface FabricObject {
    id?: string;
  }
}
export class FabricHelper {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  public findObjectById(id: string): FabricObject | null{
    let myObject = null; 
    this.canvas.getObjects().forEach(theObject => {
      if (theObject.id === id) {
        myObject = theObject;
        return;
      }
    });
    
    return myObject;
  }

}


export default FabricHelper;
