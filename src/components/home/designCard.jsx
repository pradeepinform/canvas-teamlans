"use client";

import { useState } from "react";
import DesignPreview from "./design-preview";
import { Trash2, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateDesignName } from "@/services/design-service";

export default function DesignCard({ design, handleDeleteDesign, refreshDesigns, isModalView, setShowDesignsModal }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(design.name || "Untitled");

  const handleNameUpdate = async () => {
    if (!newName.trim()) return;
    try {
      await updateDesignName(design._id, newName);
      setIsEditing(false);
      refreshDesigns();
    } catch (err) {
      console.error("Failed to update design name", err);
    }
  };

  return (
    <div
      onClick={() => {
        if (!isEditing) {
          router.push(`/editor/${design._id}`);
          if (isModalView) setShowDesignsModal(false);
        }
      }}
      className="group relative rounded-lg overflow-hidden border hover:shadow-lg transition cursor-pointer"
    >
      <div className="w-full h-64 bg-gray-100">
        {design?.canvasData && (
          <DesignPreview design={design} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition">
        <Trash2
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteDesign(design._id);
          }}
          className="w-5 h-5 text-black"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-50 text-white text-sm font-medium p-2 truncate flex items-center justify-between">
        {!isEditing ? (
          <>
            <span>{newName}</span>
            <Edit3
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            />
          </>
        ) : (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleNameUpdate}
            onKeyDown={(e) => e.key === "Enter" && handleNameUpdate()}
            className="bg-gray-900 bg-opacity-50 text-white border-none outline-none w-full"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
}
