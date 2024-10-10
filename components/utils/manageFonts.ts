import type { Canvas } from "fabric";

interface cardData {
  cardSide: string;
  cardID: string;
  thumbnail: string;
  canvas: Canvas;
  loading: boolean;
}

interface currentCanvas {
  pageNumber: number;
  pageID: string;
  canvas: Canvas;
}

interface CoverData {
  coverSide: string;
  coverID: string;
  canvas: Canvas;
}

export const selectFont = (
  font: string,
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    const fabricCanvas = activeCanvas?.canvas;
    const activeObj = fabricCanvas?.getActiveObject();
    if (activeObj && activeObj.type === "textbox") {
      activeObj.set({
        fontFamily: font,
      });

      fabricCanvas?.requestRenderAll();
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const activeObj = canvas?.getActiveObject();
    if (activeObj && activeObj.type === "textbox") {
      activeObj.set({
        fontFamily: font,
      });

      canvas?.requestRenderAll();
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const activeObj = fabricCanvas?.getActiveObject();
    if (activeObj && activeObj.type === "textbox") {
      activeObj.set({
        fontFamily: font,
      });

      fabricCanvas?.requestRenderAll();
    }
  }
};

export const selectFontStyle = (
  font: string,
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    const fabricCanvas = activeCanvas?.canvas;
    const activeObj = fabricCanvas?.getActiveObject();
    if (activeObj && activeObj.type === "textbox") {
      activeObj.set({
        fontStyle: font,
      });

      fabricCanvas?.requestRenderAll();
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const activeObj = canvas?.getActiveObject();
    if (activeObj && activeObj.type === "textbox") {
      activeObj.set({
        fontStyle: font,
      });

      canvas?.requestRenderAll();
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const activeObj = fabricCanvas?.getActiveObject();
    if (activeObj && activeObj.type === "textbox") {
      activeObj.set({
        fontStyle: font,
      });

      fabricCanvas?.requestRenderAll();
    }
  }
};

export const handleFontSize = (
  e: Event,
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  const val = e.target as HTMLInputElement;
  const fontSize = parseInt(val.value);

  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    const fabricCanvas = activeCanvas?.canvas;
    const activeObj = fabricCanvas?.getActiveObject();

    if (activeObj && activeObj.type === "textbox") {
      activeObj.set({
        fontSize: fontSize,
      });

      fabricCanvas?.requestRenderAll();
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const activeObj = canvas?.getActiveObject();

    if (activeObj && activeObj.type === "textbox")
      activeObj.set({
        fontSize: fontSize,
      });

    canvas?.requestRenderAll();
  } else {
    const fabricCanvas = activeCover.canvas;

    const activeObj = fabricCanvas?.getActiveObject();

    if (activeObj && activeObj.type === "textbox")
      activeObj.set({
        fontSize: fontSize,
      });

    fabricCanvas?.requestRenderAll();
  }
};
