import { util, type FabricObject, type Canvas } from 'fabric';
import QRCode from 'qrcode-svg';
import { loadSVGFromString } from 'fabric'; // Adjust the import path based on your project structure

export class QrCodeHelper {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;

  }


  public async generateQRCode(content: string) {
    if (!content) {
      alert('Please enter text or URL');
      return;
    }
    try {
      // Generate QR code SVG string
      const qrcode = new QRCode({
        content: content,
        padding: 4,
        width: 300,
        height: 300,
        color: '#000000',
        background: '#ffffff',
        ecl: 'H'
      });

      const svgString = qrcode.svg();

      const loadedSVG = await loadSVGFromString(svgString);
      if (loadedSVG.objects) {
        const tt = util.groupSVGElements(loadedSVG.objects as FabricObject[]);
        tt.set({
          scaleY: 1,
          scaleX: 1,
          originX: 'center',
          originY: 'center',
          visible: true,
          centeredScaling: true,
          selectable: true,
          fill: '#ff0055'
        });
        tt.setControlsVisibility({
          ml: false, // Middle left
          mb: false, // Middle bottom
          mt: false, // Middle top
          mr: false  // Middle right
        });
        this.canvas.add(tt);

        this.canvas.centerObject(tt);
        this.canvas.renderAll();
      }
    } catch (err) {
      console.error(err);
    }
  }


}


export default QrCodeHelper;
