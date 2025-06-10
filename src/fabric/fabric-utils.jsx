import { createShape } from "./shapes/shape-factory";
import { shapeDefinitions } from "./shapes/shapeDefinitions";

import { fabric } from "fabric";

export const initializeFabric = (canvasEl, containerEl) => {
  try {
    const canvas = new fabric.Canvas(canvasEl, {
      preserveObjectStacking: true,
      isDrawingMode: false,
      renderOnAddRemove: true,
    });

    const brush = new fabric.PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 5;
    canvas.freeDrawingBrush = brush;

    return canvas;
  } catch (element) {
    console.error("Failed to load fabric", element);
    return null;
  }
};


export const centerCanvas = (canvas) => {
  if (!canvas || !canvas.wrapperEl) return;

  const canvasWrapper = canvas.wrapperEl;

  canvasWrapper.style.width = `${canvas.width}px`;
  canvasWrapper.style.height = `${canvas.height}px`;

  canvasWrapper.style.position = "absolute";
  canvasWrapper.style.top = "50%";
  canvasWrapper.style.left = "50%";
  canvasWrapper.style.transform = "translate(-50%, -50%)";
};

export const addShapeToCanvas = async (canvas, shapeType, customProps = {}) => {
  if (!canvas) return null;

  try {
    const fabricModule = await import("fabric");
    const fabric = fabricModule.fabric; // this is the fix

    const shape = createShape(fabric, shapeType, shapeDefinitions, {
      left: 100,
      top: 100,
      ...customProps,
    });

    if (shape) {
      shape.id = `${shapeType}-${Date.now()}`;
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
      return shape;
    }
  } catch (error) {
    console.error("Error adding shape:", error);
    return null;
  }
};




export const addTextToCanvas = async (
  canvas,
  text,
  options = {},
  withBackground = false
) => {
  if (!canvas) return null;

  try {
    const { fabric } = await import("fabric");

    const defaultProps = {
      left: 100,
      top: 100,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000000",
      padding: withBackground ? 10 : 0,
      backgroundColor: withBackground ? "#ffffff" : "", // ✅ optional improvement
      textAlign: "left",
      id: `text-${Date.now()}`,
    };

    const textObj = new fabric.IText(text, {
      ...defaultProps,
      ...options,
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();

    return textObj;
  } catch (e) {
    console.error("Failed to add text:", e);
    return null;
  }
};




export const addImageToCanvas = async (canvas, imageUrl) => {
  if (!canvas) return null;

  try {
    const { fabric } = await import("fabric");

    let imgObj = new Image();
    imgObj.crossOrigin = "Anonymous";
    imgObj.src = imageUrl;

    return new Promise((resolve, reject) => {
      imgObj.onload = () => {
        const image = new fabric.Image(imgObj); 

        image.set({
          id: `image-${Date.now()}`,
          top: 100,
          left: 100,
          padding: 10,
          cornerSize: 10, 
        });

        const maxDimension = 400;
        const scale = maxDimension / Math.max(image.width, image.height);
        if (image.width > maxDimension || image.height > maxDimension) {
          image.scale(scale);
        }

        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.renderAll();

        resolve(image);
      };

      imgObj.onerror = () => {
        reject(new Error("Failed to load image: " + imageUrl));
      };
    });
  } catch (error) {
    console.error("Error adding image to canvas:", error);
    return null;
  }
};







export const toggleDrawingMode = (
  canvas,
  isDrawingMode,
  drawingColor = "#000000",
  brushWidth = 5
) => {
  if (!canvas) return null;

  try {
    canvas.isDrawingMode = isDrawingMode;
    if (isDrawingMode) {
      canvas.freeDrawingBrush.color = drawingColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }

    return true;
  } catch (e) {
    return false;
  }
};





export const toggleEraseMode = (
  canvas,
  isErasing,
  previousColor = "#000000",
  eraserWidth = 20
) => {
  if (!canvas || !canvas.freeDrawingBrush) return false;

  try {
    if (isErasing) {
      canvas.freeDrawingBrush.color = "#ffffff";
      canvas.freeDrawingBrush.width = eraserWidth;
    } else {
      canvas.freeDrawingBrush.color = previousColor;
      canvas.freeDrawingBrush.width = 5;
    }

    return true;
  } catch (e) {
    return false;
  }
};

export const updateDrawingBrush = (canvas, properties = {}) => {
  if (!canvas || !canvas.freeDrawingBrush) return false;

  try {
    const { color, width, opacity } = properties;
    if (color !== undefined) {
      canvas.freeDrawingBrush.color = color;
    }

    if (width !== undefined) {
      canvas.freeDrawingBrush.width = width;
    }

    if (opacity !== undefined) {
      canvas.freeDrawingBrush.opacity = opacity;
    }

    return true;
  } catch (e) {
    return false;
  }
};

export const cloneSelectedObject = (canvas) => {
  const activeObject = canvas.getActiveObject();

  if (!activeObject) {
    console.warn("No object selected to clone");
    return;
  }

  try {
    activeObject.clone((cloned) => {
      if (!cloned) {
        console.error("Cloning failed, received undefined");
        return;
      }

      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
        evented: true,
      });

      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  } catch (err) {
    console.error("Error while cloning:", err);
  }
};


export const deletedSelectedObject = async (canvas) => {
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();

  if (!activeObject) return;

  try {
    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.renderAll();

    return true;
  } catch (e) {
    console.error("Error while deleting", e);
    return false;
  }
};

export const customizeBoundingBox = (canvas) => {
  if (!canvas) return;

  try {
    canvas.on("object:added", (e) => {
      if (e.target) {
        e.target.set({
          borderColor: "#00ffe7",
          cornerColor: "#000000",
          cornerStrokeColor: "#00ffe7",
          cornerSize: 10,
          transparentCorners: false,
        });
      }
    });

    canvas.getObjects().forEach((obj) => {
      obj.set({
        borderColor: "#00ffe7",
        cornerColor: "#000000",
        cornerStrokeColor: "#00ffe7",
        cornerSize: 10,
        transparentCorners: false,
      });
    });

    canvas.renderAll();
  } catch (e) {
    console.error("Failed to customise bounding box", e);
  }
};
