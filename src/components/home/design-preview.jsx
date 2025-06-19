"use client";

import { useEffect, useRef } from "react";

function DesignPreview({ design }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    let timer;

    const loadCanvas = async () => {
      try {
        if (fabricCanvasRef.current?.dispose) {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        }

        const { fabric } = await import("fabric");
        const canvas = canvasRef.current;

        if (!canvas) return;

        // Get dynamic width & height of parent container
        const parent = canvas.parentNode;
        const width = parent.clientWidth;
        const height = parent.clientHeight;

        // Set canvas element size
        canvas.width = width;
        canvas.height = height;

        const previewCanvas = new fabric.StaticCanvas(canvas, {
          width,
          height,
          renderOnAddRemove: true,
        });

        fabricCanvasRef.current = previewCanvas;

        let parsedData;
        if (typeof design.canvasData === "string") {
          parsedData = JSON.parse(design.canvasData);
        } else {
          parsedData = design.canvasData || {};
        }

        if (!parsedData?.objects?.length) {
          previewCanvas.backgroundColor = "#f4f4f4";
          previewCanvas.requestRenderAll();
          return;
        }

        previewCanvas.loadFromJSON(parsedData, () => {
          previewCanvas.requestRenderAll();
          previewCanvas.fitToScreen?.(); // Optional if you want scaling
        });

      } catch (e) {
        console.error("Error rendering design preview:", e);
      }
    };

    timer = setTimeout(loadCanvas, 100);

    return () => {
      clearTimeout(timer);
      if (fabricCanvasRef.current?.dispose) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [design]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}

export default DesignPreview;
