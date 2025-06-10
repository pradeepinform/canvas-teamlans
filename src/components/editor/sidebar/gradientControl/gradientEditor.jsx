"use client";

import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEditorStore } from "@/store";
// Initial default gradient stops
const defaultStops = [
  { color: "#010E12", position: 0 },
  { color: "#57C785", position: 50 },
  { color: "#3A7A66", position: 100 },
];

export default function GradientEditor() {
  const [stops, setStops] = useState(defaultStops); // List of color stops
  const [selectedStopIndex, setSelectedStopIndex] = useState(0); // Currently selected stop index
  const [type, setType] = useState("linear"); // "linear" or "radial"
  const [angle, setAngle] = useState(90); // Angle for linear gradient
  const { canvas } = useEditorStore();
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); 
  const selectedStop = stops[selectedStopIndex] ?? stops[0]; // Current selected stop object

useEffect(() => {
  if (!canvas || !stops.length) return;

  import("fabric").then((mod) => {
    const fabric = mod.default || mod.fabric || mod;

    const width = canvas.getWidth();
    const height = canvas.getHeight();

    const colorStops = stops.map((stop) => ({
      offset: stop.position / 100,
      color: stop.color,
    }));

    if (stops.length === 1) {
      
      canvas.backgroundColor = stops[0].color;
      canvas.renderAll();
    } else if (type === "linear") {
      const angleRad = (angle * Math.PI) / 180;

      const x1 = width / 2 - (width / 2) * Math.cos(angleRad);
      const y1 = height / 2 - (height / 2) * Math.sin(angleRad);
      const x2 = width / 2 + (width / 2) * Math.cos(angleRad);
      const y2 = height / 2 + (height / 2) * Math.sin(angleRad);

      
      const ctx = canvas.getContext();
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);

      
      colorStops.forEach((stop) => {
        grad.addColorStop(stop.offset, stop.color);
      });

      
      canvas.backgroundColor = grad;
      canvas.renderAll();
    } else if (type === "radial") {
      const radius = Math.sqrt(width * width + height * height) / 2;

      const ctx = canvas.getContext();
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        radius
      );

      colorStops.forEach((stop) => {
        grad.addColorStop(stop.offset, stop.color);
      });

      canvas.backgroundColor = grad;
      canvas.renderAll();
    }
  });
}, [stops, type, angle, canvas]);



  // Update selected stop color
  const updateStopColor = (color) => {
    const updated = [...stops];
    updated[selectedStopIndex].color = color;
    setStops(updated);
  };

  // Update position of a stop by index
  const updateStopPosition = (index, pos) => {
    const updated = [...stops];
    updated[index].position = Math.min(100, Math.max(0, Number(pos))); // Clamp 0-100
    setStops(updated);
  };

  // Delete a stop
  const deleteStop = (index) => {
    if (stops.length <= 2) return;
    const updated = stops.filter((_, i) => i !== index);
    setStops(updated);
    setSelectedStopIndex((prev) => Math.min(prev, updated.length - 1));
  };

  // Add a new stop (up to 4)
  const addStop = () => {
    if (stops.length >= 4) return;
    setStops([...stops, { color: "#000000", position: 100 }]);
    setSelectedStopIndex(stops.length);
  };

  // Generate gradient CSS string based on type and stops
  const gradientString =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${stops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")})`
      : `radial-gradient(circle, ${stops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ")})`;

  
  return (
    <div className="p-2 max-w-3xl mx-auto space-y-2">
      {/* Gradient Preview */}
      <div className="space-y-2">
  <p className="text-[11px]  font-medium text-gray-500">Preview</p>
  <div className="w-[22rem] rounded border shadow-inner overflow-hidden">
    <div
      className="h-24 w-full rounded"
      style={{ background: gradientString }}
    />
  </div>
</div>                            

      {/* Stop Position Sliders */}
      <div className="flex flex-wrap gap-2">
        {stops.map((stop, index) => (
          <div key={index} className="flex flex-col items-center space-y-1">
            <input
              type="range"
              min={0}
              max={100}
              value={stop.position}
              onChange={(e) => updateStopPosition(index, e.target.value)}
              className="w-15"
              onClick={() => setSelectedStopIndex(index)} // Select on click
            />
            <Input
              type="number"
              value={stop.position}
              onChange={(e) => updateStopPosition(index, e.target.value)}
              className="w-18 text-xs text-center"
            />
          </div>
        ))}
      </div>

      {/* Color Picker and Stop Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Hex Color Picker */}
        <div className="space-y-2 w-full">
          <div className="rounded overflow-hidden border w-[11rem] h-[12rem]">
            <HexColorPicker
              color={selectedStop.color}
              onChange={updateStopColor}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* Hex Color Input */}
          <h2 className="text-gray-400 ml-2">HEX</h2>
          <Input
            value={selectedStop.color}
            onChange={(e) => updateStopColor(e.target.value)}
            className="text-xs h-7 px-2"
          />

          {/* RGB Display (Read-only) */}
          <div className="flex gap-2">
            {/* R, G, B, A label and value */}
            {["R", "G", "B"].map((label, i) => {
              const hex = selectedStop.color.slice(1);
              const value = parseInt(hex.substring(i * 2, i * 2 + 2), 16) || 0;
              return (
                <div key={label} className="flex flex-col items-center">
                  <span className="text-[10px] font-medium text-gray-400">
                    {label}
                  </span>
                  <Input
                    className="w-10 h-7 text-center text-xs px-1"
                    readOnly
                    value={value}
                  />
                </div>
              );
            })}

            {/* Alpha value (100% fixed for now) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-medium">A</span>
              <Input
                className="w-10 h-7 text-center text-xs px-1"
                readOnly
                value="100"
              />
            </div>
          </div>
        </div>

        {/* List of All Color Stops */}
        <div className="w-full sm:w-1/2">
          <div className="text-xs font-semibold mb-2 text-gray-700">
            Color Stops
          </div>

          <div className="space-y-2 max-h-40 pr-1">
            {stops.map((stop, index) => (
              <div
                key={index}
                className={`flex items-center justify-between gap-2 p-2 rounded border transition-all ${
                  selectedStopIndex === index
                    ? "bg-slate-100 border-blue-300"
                    : "bg-white"
                }`}
              >
                {/* Color button (preview and select) */}
                <button
                  onClick={() => setSelectedStopIndex(index)}
                  className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: stop.color }}
                />

                {/* Hex input for each stop */}

                <Input
                  value={stop.color}
                  onChange={(e) => {
                    const updated = [...stops];
                    updated[index].color = e.target.value;
                    setStops(updated);
                  }}
                  className="w-24 h-7 text-xs px-2"
                />

                {/* Delete stop */}
                {stops.length > 2 && (
                  <button onClick={() => deleteStop(index)} title="Remove stop">
                    <X className="w-4 h-4 text-gray-400 hover:text-red-500 transition" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add new stop button */}
          {stops.length < 4 && (
            <Button
              onClick={addStop}
              className="mt-3 h-7 w-full px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              + Add Stop
            </Button>
          )}
        </div>
      </div>

      {/* Gradient Type Selector & Angle Input */}
      <div className="flex items-center justify-center my-4">
        <ToggleGroup
          type="single"
          value={type}
          onValueChange={(val) => setType(val || "linear")}
          className="flex rounded-full border border-blue-500 overflow-hidden"
        >
          <ToggleGroupItem
            value="linear"
            className="px-5 py-2 text-sm font-medium text-blue-700 bg-white hover:bg-blue-500 hover:text-white transition-colors"
          >
            Linear
          </ToggleGroupItem>
          <ToggleGroupItem
            value="radial"
            className="px-5 py-2 text-sm font-medium text-blue-700 bg-white hover:bg-blue-500 hover:text-white transition-colors"
          >
            Radial
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Angle input (only for linear gradients) */}
      {type === "linear" && (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={360}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-32"
          />
          <Input
            className="w-20 text-xs"
            type="number"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            min={0}
            max={360}
          />
          <span className="text-xs">°</span>
        </div>
      )}
    </div>
  );
}
