import { Textbox, type Canvas } from "fabric";

interface CustomTextboxOptions {
  side?: string;
  left?: number;
  top?: number;
  width?: number;
  fontSize?: number;
  fill?: string;
  editable?: boolean;
  fontFamily?: string;
  originX?: string;
  originY?: string;
  textAlign?: string;
  angle?: number;
  clipPath?: object | null;
}

const cardModeText: CustomTextboxOptions = {
  side: "left",
  left: 50,
  top: 150,
  width: 250,
  fontSize: 52,
  fill: "black",
  editable: true,
  fontFamily: "Verdana",
  originX: "center",
  originY: "center",
  textAlign: "center",
  angle: 0,
  clipPath: null,
};

class CustomTextbox extends Textbox {
  constructor(canvas: Canvas | null, text: string) {
    const options: object = { ...cardModeText };

    super(text, options);

    this.canvas = canvas!;

    const zoom = this.canvas.getZoom();
    this.set({
      left: this.canvas.width / 2 / zoom,

      top: this.canvas.height / 2 / zoom,
    });
  }
}

export default CustomTextbox;
