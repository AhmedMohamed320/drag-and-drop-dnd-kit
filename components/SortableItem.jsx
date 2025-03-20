"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ item, isChildOf, onDeleteFromMenu }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      parentId: isChildOf || null,
      source: "MAIN_MENU",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 text-gray-800 p-2 rounded-sm flex justify-between items-center gap-2"
    >
      <div
        className="flex items-center gap-2 cursor-grab w-full"
        {...attributes}
        {...listeners}
      >
        <p>{item.title}</p>
        <p className="text-xs text-gray-600">({item.type})</p>
      </div>
      <button
        className="text-sm bg-red-500 text-gray-100 p-1 px-2 rounded cursor-pointer"
        onClick={() => {     
          if (onDeleteFromMenu) {
            onDeleteFromMenu(item.id, isChildOf || null);
          }
        }}
      >
        delete
      </button>
    </div>
  );
}
