"use client";
import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import DraggableTypeItem from "./DraggableTypeItem";

export default function TypeList({
    items,
    onAddLinkToMenu,
    onAddParentToMenu,
}) {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection((prev) => (prev === section ? null : section));
    };

    return (
        <div className="flex flex-col">
            <div>
                {Object.keys(items).map((dataKey, index) => (
                    <TypeSection
                        key={dataKey}
                        dataKey={dataKey}
                        sectionData={items[dataKey]}
                        index={index}
                        activeSection={activeSection}
                        toggleSection={toggleSection}
                        onAddLinkToMenu={onAddLinkToMenu}
                        onAddParentToMenu={onAddParentToMenu}
                    />
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------
function TypeSection({
    dataKey,
    sectionData,
    index,
    activeSection,
    toggleSection,
    onAddLinkToMenu,
    onAddParentToMenu,
}) {
// console.log(dataKey);
    const { setNodeRef, isOver } = useDroppable({
        id: `typelist-zone-${dataKey}`,
        data: {
            source: "TYPE_LIST",
            allowedType: dataKey,
        },
    });

    return (
        <div>
            <div
                onClick={() => toggleSection(index)}
                className="py-3 cursor-pointer font-semibold"
            >
                {dataKey}
            </div>

            {activeSection === index && (
                <>
                    {index === 4 && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const title = e.target.title.value.trim();
                                const url = e.target.url.value.trim();
                                if (!title || !url) {
                                    alert("Title/URL cannot be empty!");
                                    return;
                                }
                                onAddLinkToMenu(title, url);
                                e.target.reset();
                            }}
                            className="flex flex-col gap-2 text-sm border p-2 rounded mb-4"
                        >
                            <div className="flex flex-col gap-1">
                                <input
                                    type="text"
                                    id="title"
                                    placeholder="title"
                                    required
                                    className="bg-gray-100 text-gray-800 rounded outline-none p-1"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <input
                                    type="text"
                                    id="url"
                                    placeholder="url"
                                    required
                                    className="bg-gray-100 text-gray-800 rounded outline-none p-1"
                                />
                            </div>
                            <button className="bg-blue-500 p-1 rounded w-full px-8 m-auto cursor-pointer text-sm">
                                Add
                            </button>
                        </form>
                    )}
                    {index === 5 && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const parentTitle =
                                    e.target.parentTitle.value.trim();
                                if (!parentTitle) {
                                    alert("Parent Title cannot be empty!");
                                    return;
                                }
                                onAddParentToMenu(parentTitle);
                                e.target.reset();
                            }}
                            className="flex flex-col gap-2 text-sm border p-2 rounded mb-4"
                        >
                            <div className="flex flex-col gap-1">
                                <input
                                    type="text"
                                    id="parentTitle"
                                    placeholder="title"
                                    required
                                    className="bg-gray-100 text-gray-800 rounded outline-none p-1"
                                />
                            </div>
                            <button className="bg-blue-500 p-1 rounded w-full px-8 m-auto cursor-pointer">
                                Add To Menu
                            </button>
                        </form>
                    )}

                    <div
                        ref={setNodeRef}
                        style={{
                            backgroundColor: isOver ? "#f0f8ff" : "",
                            transition: "background-color 0.2s",
                        }}
                        className="px-2 flex flex-col gap-2 border-l border-dashed border-gray-300 ms-4"
                    >
                        {sectionData.list.map((item) => (
                            <DraggableTypeItem key={item.id} item={item} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
