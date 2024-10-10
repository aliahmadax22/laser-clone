import { Textbox, type Canvas } from 'fabric';

export class textObjectHelper {
  private canvas: Canvas;
  private selectedColor: { value: string };

  constructor(canvas: Canvas, selectedColor: { value: string }) {
    this.canvas = canvas;
    this.selectedColor = selectedColor;
  }


  public addText() {
    const placeholderText = "My Text";
    const text = new Textbox(placeholderText, {
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
      width: 200,
      fontSize: 24,
      fill: this.selectedColor.value,
      editable: true,
      fontFamily: 'Verdana',
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
      angle: -90
    });
    this.canvas.add(text);
    text.on('selected', (e) => {
      if (typeof e.target.fill === 'string') {
        this.selectedColor.value = e.target.fill;
      }
    });

    this.canvas.setActiveObject(text);
  }

  public changeColor = () => {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'textbox') {
        activeObject.set('fill', this.selectedColor.value);
        this.canvas.renderAll();
      }
    }
  };


}


export default textObjectHelper;
