"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import ChildContainer from "./ChildContainer";

export default function MainMenu({ items, onDeleteFromMenu }) {
  const { setNodeRef } = useDroppable({
    id: "MAIN_MENU-zone",
    data: {
      parentId: null,
      source: "MAIN_MENU",
    },
  });

  return (
    <>
      <div className="text-center mb-4 text-xl capitalize">main menu</div>

      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex flex-col gap-2"
          style={{ minHeight: "60px" }}
        >
          {items.length === 0 && (
            <p className="text-sm text-gray-400 italic">No items yet</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <SortableItem item={item} onDeleteFromMenu={onDeleteFromMenu} />
              {item.type === "parent" && (
                <ChildContainer
                  parentId={item.id}
                  childrenItems={item.children || []}
                  onDeleteFromMenu={onDeleteFromMenu}
                />
              )}
            </div>
          ))}
        </div>
      </SortableContext>
    </>
  );
}
