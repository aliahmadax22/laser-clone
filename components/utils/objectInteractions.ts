import type { Canvas } from "fabric";
import type ModifyObjectHelper from "../artwork-upload-mode/helpers/modifyObject";

interface currentCanvas {
  pageNumber: number;
  pageID: string;
  canvas: Canvas;
}

interface cardData {
  cardSide: string;
  cardID: string;
  thumbnail: string;
  canvas: Canvas;
  loading: boolean;
}

interface CoverData {
  coverSide: string;
  coverID: string;
  canvas: Canvas;
}

//ScaleToFit
export const scaleToFit = (
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  objectModifier: ModifyObjectHelper,
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const objectToScale = fabricCanvas.getActiveObject();

      const zoom = fabricCanvas.getZoom();

      if (objectToScale && fabricCanvas && zoom) {
        objectModifier.scaleToFit(
          objectToScale,
          fabricCanvas.width / zoom,
          fabricCanvas.height / zoom
        );

        fabricCanvas.fire("object:modified", {
          target: objectToScale,
        });

        fabricCanvas.requestRenderAll();
      }
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const objectToScale = canvas.getActiveObject();
    const zoom = canvas.getZoom();

    if (objectToScale && canvas && zoom) {
      objectModifier.scaleToFit(
        objectToScale,
        canvas.width / zoom,
        canvas.height / zoom
      );

      canvas.fire("object:modified", {
        target: objectToScale,
      });
      canvas.requestRenderAll();
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const objectToScale = fabricCanvas.getActiveObject();
    const zoom = fabricCanvas.getZoom();

    if (objectToScale && fabricCanvas && zoom) {
      objectModifier.scaleToFit(
        objectToScale,
        fabricCanvas.width / zoom,
        fabricCanvas.height / zoom
      );

      fabricCanvas.fire("object:modified", {
        target: objectToScale,
      });

      fabricCanvas.requestRenderAll();
    }
  }
};

//scaleToCover
export const scaleToCover = (
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  objectModifier: ModifyObjectHelper,
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const objectToScale = fabricCanvas.getActiveObject();
      const zoom = fabricCanvas.getZoom();

      if (objectToScale && fabricCanvas && zoom) {
        objectModifier.scaleToCover(
          objectToScale,
          fabricCanvas.width / zoom,
          fabricCanvas.height / zoom
        );

        fabricCanvas.fire("object:modified", {
          target: objectToScale,
        });

        fabricCanvas.requestRenderAll();
      }
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const objectToScale = canvas.getActiveObject();
    const zoom = canvas.getZoom();

    if (objectToScale && canvas && zoom) {
      objectModifier.scaleToCover(
        objectToScale,
        canvas.width / zoom,
        canvas.height / zoom
      );

      canvas.fire("object:modified", {
        target: objectToScale,
      });

      canvas.requestRenderAll();
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const objectToScale = fabricCanvas.getActiveObject();
    const zoom = fabricCanvas.getZoom();

    if (objectToScale && fabricCanvas && zoom) {
      objectModifier.scaleToCover(
        objectToScale,
        fabricCanvas.width / zoom,
        fabricCanvas.height / zoom
      );

      fabricCanvas.fire("object:modified", {
        target: objectToScale,
      });

      fabricCanvas.requestRenderAll();
    }
  }
};

//rotateCW Clockwise 90
export const rotateCW = (
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  objectModifier: ModifyObjectHelper,
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const objectToRotate = fabricCanvas.getActiveObject();
      if (objectToRotate && fabricCanvas) {
        objectModifier.rotateCW(objectToRotate);

        fabricCanvas.fire("object:modified", {
          target: objectToRotate,
        });
        fabricCanvas.requestRenderAll();
      }
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const objectToRotate = canvas.getActiveObject();
    if (objectToRotate && canvas) {
      objectModifier.rotateCW(objectToRotate);

      canvas.fire("object:modified", {
        target: objectToRotate,
      });

      canvas.requestRenderAll();
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const objectToRotate = fabricCanvas.getActiveObject();
    if (objectToRotate && fabricCanvas) {
      objectModifier.rotateCW(objectToRotate);

      fabricCanvas.fire("object:modified", {
        target: objectToRotate,
      });

      fabricCanvas.requestRenderAll();
    }
  }
};

//rotateACW AntiClockWise -90
export const rotateACW = (
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  objectModifier: ModifyObjectHelper,
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const objectToRotate = fabricCanvas.getActiveObject();
      if (objectToRotate) {
        if (objectToRotate && fabricCanvas) {
          objectModifier.rotateACW(objectToRotate);

          fabricCanvas.fire("object:modified", {
            target: objectToRotate,
          });

          fabricCanvas.requestRenderAll();
        }
      }
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const objectToRotate = canvas.getActiveObject();
    if (objectToRotate) {
      if (objectToRotate && canvas) {
        objectModifier.rotateACW(objectToRotate);

        canvas.fire("object:modified", {
          target: objectToRotate,
        });

        canvas.requestRenderAll();
      }
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const objectToRotate = fabricCanvas.getActiveObject();
    if (objectToRotate) {
      if (objectToRotate && fabricCanvas) {
        objectModifier.rotateACW(objectToRotate);

        fabricCanvas.fire("object:modified", {
          target: objectToRotate,
        });

        fabricCanvas.requestRenderAll();
      }
    }
  }
};

//SendToBack
export const sendToBack = (
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

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject && fabricCanvas) {
        fabricCanvas.sendObjectToBack(activeObject);

        fabricCanvas.fire("object:modified", {
          target: activeObject,
        });

        fabricCanvas.requestRenderAll();
      }
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const activeObject = canvas.getActiveObject();
    if (activeObject && canvas) {
      canvas.sendObjectToBack(activeObject);

      canvas.fire("object:modified", {
        target: activeObject,
      });

      canvas.requestRenderAll();
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && fabricCanvas) {
      fabricCanvas.sendObjectToBack(activeObject);

      fabricCanvas.fire("object:modified", {
        target: activeObject,
      });

      fabricCanvas.requestRenderAll();
    }
  }
};

//bringToFront
export const bringToFront = (
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

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.bringObjectToFront(activeObject);

        fabricCanvas.fire("object:modified", {
          target: activeObject,
        });

        fabricCanvas.requestRenderAll();
      }
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringObjectToFront(activeObject);

      canvas.fire("object:modified", {
        target: activeObject,
      });

      canvas.requestRenderAll();
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.bringObjectToFront(activeObject);

      fabricCanvas.fire("object:modified", {
        target: activeObject,
      });

      fabricCanvas.requestRenderAll();
    }
  }
};

//sendBackwards
export const sendBackwards = (
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

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.sendObjectBackwards(activeObject);

        fabricCanvas.fire("object:modified", {
          target: activeObject,
        });

        fabricCanvas.requestRenderAll();
      }
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendObjectBackwards(activeObject);

      canvas.fire("object:modified", {
        target: activeObject,
      });

      canvas.requestRenderAll();
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.sendObjectBackwards(activeObject);

      fabricCanvas.fire("object:modified", {
        target: activeObject,
      });

      fabricCanvas.requestRenderAll();
    }
  }
};

//bringForward
export const bringForward = (
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

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.bringObjectForward(activeObject);
        fabricCanvas.fire("object:modified", {
          target: activeObject,
        });

        fabricCanvas.requestRenderAll();
      }
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringObjectForward(activeObject);
      canvas.fire("object:modified", {
        target: activeObject,
      });

      canvas.requestRenderAll();
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.bringObjectForward(activeObject);

      fabricCanvas.fire("object:modified", {
        target: activeObject,
      });

      fabricCanvas.requestRenderAll();
    }
  }
};

//Delete active object
export const deleteActiveObject = (
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

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.remove(activeObject);
        fabricCanvas.requestRenderAll();
      }
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.requestRenderAll();
    }
  } else {
    const fabricCanvas = activeCover.canvas;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.requestRenderAll();
    }
  }
};

//ChangeColor of active text
export const changeColor = (
  e: Event,
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  objectModifier: ModifyObjectHelper,
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  const color = e.target as HTMLInputElement;

  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const activeObject = fabricCanvas.getActiveObject();

      if (activeObject) {
        objectModifier.changeColor(activeObject, color.value);
      }

      if (fabricCanvas && activeObject)
        fabricCanvas.fire("object:modified", {
          target: activeObject,
        });

      fabricCanvas.requestRenderAll();
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      objectModifier.changeColor(activeObject, color.value);
    }

    if (canvas && activeObject)
      canvas.fire("object:modified", {
        target: activeObject,
      });
    canvas.requestRenderAll();
  } else {
    const fabricCanvas = activeCover.canvas;

    const activeObject = fabricCanvas.getActiveObject();

    if (activeObject) {
      objectModifier.changeColor(activeObject, color.value);
    }

    if (fabricCanvas && activeObject)
      fabricCanvas.fire("object:modified", {
        target: activeObject,
      });
    fabricCanvas.requestRenderAll();
  }
};
