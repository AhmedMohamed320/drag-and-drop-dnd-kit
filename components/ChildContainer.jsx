"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

export default function ChildContainer({
    parentId,
    childrenItems,
    onDeleteFromMenu,
}) {
    const { setNodeRef } = useDroppable({
        id: `child-zone-${parentId}`,
        data: {
            parentId,
            source: "MAIN_MENU",
        },
    });

    return (
        <div
            ref={setNodeRef}
            className="ms-8 flex flex-col justify-center gap-2 border-l border-dashed border-gray-300 pl-2"
            style={{ minHeight: "40px" }}
        >
            <SortableContext
                items={childrenItems.map((child) => child.id)}
                strategy={verticalListSortingStrategy}
            >
                {childrenItems.length > 0 ? (
                    childrenItems.map((child) => (
                        <SortableItem
                            key={child.id}
                            item={child}
                            isChildOf={parentId}
                            onDeleteFromMenu={onDeleteFromMenu}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500 italic">
                        No child in this parent
                    </p>
                )}
            </SortableContext>
        </div>
    );
}
