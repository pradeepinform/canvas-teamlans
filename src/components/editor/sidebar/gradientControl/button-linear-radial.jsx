import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import GradientEditor from "./gradientEditor";

const GradientTypeSelector = () => {
  return (
    <div className="relative p-2">
      <Sheet>
        <SheetTrigger asChild>
          <button className="px-4 py-2 w-full rounded-md border cursor-pointer border-purple-800 bg-blue-500 text-black text-sm font-medium hover:bg-blue-700 hover:text-white transition">
            Change Gradient Color
          </button>
        </SheetTrigger>

        {/* Specify side="left" here */}
        <SheetContent className="sheet-overlay" side="left">
          <SheetHeader>
            <SheetTitle>Change Gradient Color</SheetTitle>
          </SheetHeader>
          
          <GradientEditor />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default GradientTypeSelector;
