"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { colorPresets } from "@/options";
import { Check, Palette } from "lucide-react";
import { centerCanvas } from "@/fabric/fabric-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GradientTypeSelector from "../gradientControl/button-linear-radial";

function SettingsPanel() {
  const [fabric, setFabric] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const { canvas, markAsModified } = useEditorStore();
  const [isClient, setIsClient] = useState(false);
  const [gradients, setGradients] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🆕 Gradient Type State (used with custom gradients)
  const [gradientType, setGradientType] = useState("linear");

  useEffect(() => {
    const fetchGradients = async () => {
      try {
        const res = await fetch("http://localhost:2000/api/gradients/");
        const data = await res.json();
        setGradients(data);
      } catch (error) {
        console.error("Error fetching gradients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGradients();
  }, []);

  useEffect(() => {
    setIsClient(true);
    import("fabric").then((mod) => {
      setFabric(mod.fabric || mod);
    });
  }, []);

  useEffect(() => {
    if (!canvas || !isClient || !fabric) return;

    if (typeof backgroundColor === "string") {
      canvas.set("backgroundColor", backgroundColor);
    } else if (backgroundColor?.colors) {
      const gradColors = backgroundColor.colors;

      const gradient = new fabric.Gradient({
        type: backgroundColor.type || "linear", // 🆕 use selected gradient type
        coords:
          backgroundColor.type === "radial"
            ? {
                x1: canvas.getWidth() / 2,
                y1: canvas.getHeight() / 2,
                r1: 0,
                x2: canvas.getWidth() / 2,
                y2: canvas.getHeight() / 2,
                r2: Math.max(canvas.getWidth(), canvas.getHeight()) / 2,
              }
            : {
                x1: 0,
                y1: 0,
                x2: canvas.getWidth(),
                y2: 0,
              },
        colorStops: gradColors.map((color, index) => ({
          offset: index / (gradColors.length - 1),
          color,
        })),
      });

      canvas.set("backgroundColor", gradient);
    }

    canvas.renderAll();
    centerCanvas(canvas);
    markAsModified();
  }, [backgroundColor, canvas, isClient, fabric, markAsModified]);

  const handleColorChange = (e) => {
    setBackgroundColor(e.target.value);
  };

  const handleColorPresetApply = (color) => {
    setBackgroundColor(color);
  };

  const handleGradientApply = (gradient) => {
    setBackgroundColor({ type: gradientType, colors: gradient.colors }); // 🆕 include selected type
  };

  // 🆕 Update type when user changes gradient type
  const handleGradientTypeChange = (type) => {
    setGradientType(type);

    if (
      typeof backgroundColor !== "string" &&
      backgroundColor?.colors
    ) {
      setBackgroundColor({
        type,
        colors: backgroundColor.colors,
      });
    }
  };

  if (!isClient) return null;

  return (
    <div className="p-2 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Palette className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Default Background Colour</h3>
      </div>

      {/* Solid Color Section */}
      <div className="space-y-2">
        <p className="text-[11px] mt-2 font-medium text-gray-500">
          Solid Colour
        </p>
        <div className="grid grid-cols-6 gap-2 mb-3">
          {colorPresets.map((color) => (
            <TooltipProvider key={color}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={`w-11 h-11 cursor-pointer rounded-full border transition-transform hover:scale-110 ${
                      color === backgroundColor
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorPresetApply(color)}
                    aria-label={`Apply solid color ${color}`}
                  >
                    {color === backgroundColor && (
                      <Check className="w-4 h-4 text-white mx-auto drop-shadow-md" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{color}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <div className="flex mt-3 space-x-2">
          <Input
            type="color"
            value={
              typeof backgroundColor === "string" ? backgroundColor : "#ffffff"
            }
            onChange={handleColorChange}
            className="w-12 h-10 p-1 cursor-pointer"
            aria-label="Select color using color picker"
          />
          <Input
            type="text"
            value={typeof backgroundColor === "string" ? backgroundColor : ""}
            onChange={handleColorChange}
            className="flex-1 h-10"
            placeholder="#FFFFFF"
            aria-label="Input color hex code"
          />
        </div>

        <Separator className="my-4" />

        {/* Gradient Color Section */}
        <div className="space-y-2">
          <p className="text-[11px] mt-2 font-medium text-gray-500">
            Gradient Colour
          </p>

          {loading ? (
            <p className="text-sm text-gray-400">Loading gradients...</p>
          ) : (
            <div className="grid grid-cols-6 gap-2 mb-3">
              {gradients.map((gradient, index) => {
                const gradientStyle = {
                  background: `linear-gradient(90deg, ${gradient.colors.join(
                    ", "
                  )})`,
                };

                const isSelected =
                  typeof backgroundColor !== "string" &&
                  backgroundColor?.colors?.join() === gradient.colors.join();

                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={`w-11 h-11 rounded-full cursor-pointer border transition-transform hover:scale-110 ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-primary"
                              : ""
                          }`}
                          style={gradientStyle}
                          onClick={() => handleGradientApply(gradient)}
                          aria-label={`Apply gradient: ${gradient.colors.join(
                            " to "
                          )}`}
                        >
                          {isSelected && (
                            <Check className="w-4 h-4 text-white mx-auto drop-shadow-md" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{gradient.colors.join(" → ")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        {/* 🆕 Gradient Type Selector */}
        <div>
          <GradientTypeSelector
            selectedType={gradientType}
            onChange={handleGradientTypeChange}
          />
          <Separator />
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
