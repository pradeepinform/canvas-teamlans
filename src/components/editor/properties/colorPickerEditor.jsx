"use client";

import { ChromePicker, CirclePicker } from "react-color";

function ColorPickerEditor({ value, onColorChange }) {
  return (
    <div className="space-y-4">
      <ChromePicker
        color={value}
        onChange={(element) => onColorChange(element.hex)}
        className="border-r rounded-xl mb-5"
      />
      <CirclePicker
        color={value}
        onChange={(element) => onColorChange(element.hex)}
        className=""
      />
    </div>
  );
}

export default ColorPickerEditor;
