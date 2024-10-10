import type { Ref } from 'vue';
import { Line } from 'fabric';
import type { BasicTransformEvent, Canvas, FabricObject } from 'fabric';

interface FabricObjectEvent extends BasicTransformEvent {
  target: FabricObject;
}

interface FabricSelectedEvent extends BasicTransformEvent {
  selected: FabricObject[];
  deselected: FabricObject[];
}

export class PerforationLinesHelper {
  private canvas: Canvas;
  public lineProps: Ref<{ top: number; left: number }>;
  public activeSide: Ref<string | "front">;
  private selectedLine: Ref<FabricObject | null>;

  constructor(canvas: Canvas, lineProps: Ref<{ top: number; left: number }>, selectedLine: Ref<FabricObject | null>, activeSide: Ref<string>) {
    this.canvas = canvas;
    this.activeSide = activeSide;  // Initialize the reactive reference with 'front'
    this.lineProps = lineProps;
    this.selectedLine = selectedLine;
    this.init();
  }

  private init() {
    console.log(this.activeSide.value);
    this.canvas.on('object:moving', this.onMoving.bind(this));
    this.canvas.on('selection:created', this.onSelectionCreated.bind(this));
    this.canvas.on('selection:updated', this.onSelectionUpdated.bind(this));
    this.canvas.on('selection:cleared', this.onSelectionCleared.bind(this));
  }

  private onMoving(options: FabricObjectEvent) {
    //Update lineProps for manual coordinates
    const obj = options.target;
    if (obj && obj.type === 'line') {
      const line = obj as FabricObject;
      this.lineProps.value.top = line.top || 0;
      this.lineProps.value.left = line.left || 0;
    }
  }

  private onSelectionCreated(e: FabricSelectedEvent) {
    if (e.selected && e.selected.length) {
      const obj = e.selected[0];
      if (obj.type === 'line') {
        this.selectedLine.value = obj as FabricObject;
        this.lineProps.value.top = this.selectedLine.value.top || 0;
        this.lineProps.value.left = this.selectedLine.value.left || 0;
      } else {
        this.selectedLine.value = null;
      }
    }
  }

  private onSelectionUpdated(e: FabricSelectedEvent) {
    if (e.selected && e.selected.length) {
      const obj = e.selected[0];
      if (obj.type === 'line') {
        this.selectedLine.value = obj as FabricObject;
        this.lineProps.value.top = this.selectedLine.value.top || 0;
        this.lineProps.value.left = this.selectedLine.value.left || 0;
      } else {
        this.selectedLine.value = null;
      }
    }
  }

  private onSelectionCleared() {
    this.selectedLine.value = null;
  }

  public updateLineCoordinates() {
    if (this.selectedLine.value) {
      this.selectedLine.value.set({
        top: this.lineProps.value.top,
        left: this.lineProps.value.left,
      });
      this.selectedLine.value.setCoords(); // Ensure the object's bounding box is updated
      this.canvas.renderAll();
    }
  }

  public addPerforationLineHorizontal = () => {
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();

    const dashedLineHorizontal = new Line([0, canvasHeight / 2, canvasWidth, canvasHeight / 2], {
      stroke: '#FF0000',
      strokeDashArray: [10, 10], // Creates the dashed effect
      selectable: true, // Makes the line non-selectable
      evented: true, // Disables event handling for the line
      originX: 'center',
      originY: 'center',
      opacity: 1,
      strokeWidth: 3,
      layout: true,
      padding: 20
    });

    this.canvas.add(dashedLineHorizontal);
    this.canvas.setActiveObject(dashedLineHorizontal);
    this.canvas.renderAll();
  };

  public addPerforationLineVertical = () => {
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();

    const dashedLineVertical = new Line([canvasWidth / 2, 0, canvasWidth / 2, canvasHeight], {
      stroke: '#FF0000',
      strokeDashArray: [10, 10], // Creates the dashed effect
      selectable: true, // Makes the line non-selectable
      evented: true, // Disables event handling for the line
      originX: 'center',
      originY: 'center',
      opacity: 1,
      strokeWidth: 3,
      layout: true,
      padding: 20
    });

    this.canvas.add(dashedLineVertical);
    this.canvas.setActiveObject(dashedLineVertical);
    this.canvas.renderAll();
  };


}


export default PerforationLinesHelper;
