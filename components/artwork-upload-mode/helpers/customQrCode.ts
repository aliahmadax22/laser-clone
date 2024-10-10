import { Group, loadSVGFromString, type Canvas } from "fabric";
import QRCode from "qrcode-svg";
import { addToCanvas } from "../addToCanvas";
import type Page from "./Pages";

interface inlinePage {
  pageNumber?: number;
  page?: Page;
}

class CustomQrCode extends Group {
  text: string;
  side: string;
  inlinePages: inlinePage[];
  currentCanvasRef: inlinePage[];
  modeType: string;
  activePageID: string | null;

  constructor(
    text: string,
    canvas: Canvas,
    side: string,
    inlinePages: inlinePage[],
    currentCanvasRef: inlinePage[],
    modeType: string,
    activePageID: string | null
  ) {
    super([], { left: 0, top: 0 });

    this.text = text;
    this.canvas = canvas;
    this.side = side;
    this.inlinePages = inlinePages;
    this.modeType = modeType;
    this.currentCanvasRef = currentCanvasRef;
    this.activePageID = activePageID;
    this.generateCode();
  }

  async generateCode() {
    try {
      const qrcode = new QRCode({
        content: this.text,
        padding: 4,
        width: 300,
        height: 300,
        color: "#000000",
        background: "#ffffff",
        ecl: "H",
      });

      const svgString = qrcode.svg();

      const loadedSVG = await loadSVGFromString(svgString);

      if (this.modeType === "page") {
        const activeCanvas = this.currentCanvasRef.find((cnv) => {
          if (cnv.page) {
            return cnv.page.pageID === this.activePageID;
          }
        });

        addToCanvas(
          this,
          activeCanvas,
          this.canvas,
          this.inlinePages,
          this.modeType
        );
      } else {
        addToCanvas(this, null, this.canvas, this.inlinePages, this.modeType);
      }

      if (this.canvas) {
        loadedSVG.objects.forEach((obj) => {
          if (obj) {
            this.add(obj);
          }
        });

        this.setCoords();
        this.canvas.requestRenderAll();
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default CustomQrCode;
