"use client";
import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import TypeList from "@/components/TypeList";
import MainMenu from "@/components/MainMenu";
import { initialMainMenu, initialTypeList } from "../public/initialData";

export default function Home() {
  const [typeList, setTypeList] = useState(initialTypeList);
  const [menuList, setMenuList] = useState(initialMainMenu);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function getItemFromTypeList(itemId) {
    for (const key of Object.keys(typeList)) {
      const arr = typeList[key].list;
      const found = arr.find((x) => x.id === itemId);
      if (found) return found;
    }
    return null;
  }

  function removeFromTypeList(itemId) {
    const newData = structuredClone(typeList);
    for (const key of Object.keys(newData)) {
      const arr = newData[key].list;
      const idx = arr.findIndex((x) => x.id === itemId);
      if (idx !== -1) {
        arr.splice(idx, 1);
        break;
      }
    }
    setTypeList(newData);
  }

  function addToTypeList(item) {
    const newData = structuredClone(typeList);
    const foundKey = Object.keys(newData).find((k) => k === item.type);
    if (foundKey) {
      newData[foundKey].list.push(item);
    } else {
      const firstKey = Object.keys(newData)[0];
      newData[firstKey].list.push(item);
    }
    setTypeList(newData);
  }

  function getItemFromMenuList(itemId, list) {
    const targetList = list || menuList;
    let found = targetList.find((x) => x.id === itemId);
    if (found) return found;
    for (const parent of targetList) {
      if (!parent.children) continue;
      found = parent.children.find((c) => c.id === itemId);
      if (found) return found;
    }
    return null;
  }

  function removeItemFromMenu(list, itemId, parentId) {
    if (parentId === null) {
      const idx = list.findIndex((x) => x.id === itemId);
      if (idx !== -1) {
        list.splice(idx, 1);
      }
    } else {
      const pIndex = list.findIndex((p) => p.id === parentId);
      if (pIndex !== -1) {
        const children = list[pIndex].children || [];
        const cIndex = children.findIndex((c) => c.id === itemId);
        if (cIndex !== -1) {
          children.splice(cIndex, 1);
          list[pIndex].children = children;
        }
      }
    }
  }

  function insertItemInMenu(list, item, parentId, overId) {
    if (parentId === null) {
      const overIndex = list.findIndex((x) => x.id === overId);
      if (overIndex === -1) {
        list.push(item);
      } else {
        list.splice(overIndex, 0, item);
      }
    } else {
      const pIndex = list.findIndex((p) => p.id === parentId);
      if (pIndex === -1) {
        list.push(item);
      } else {
        if (!list[pIndex].children) {
          list[pIndex].children = [];
        }
        const children = list[pIndex].children;
        const overIndex = children.findIndex((c) => c.id === overId);
        if (overIndex === -1) {
          children.push(item);
        } else {
          children.splice(overIndex, 0, item);
        }
        list[pIndex].children = children;
      }
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const activeData = active.data.current;
    const overData = over.data.current || {};
    const source = activeData.source;
    const target = overData.source;
    const oldParentId = activeData.parentId || null;
    const newParentId = overData.parentId || null;
    if (source === "MAIN_MENU" && target === "MAIN_MENU") {
      const draggedItem = getItemFromMenuList(active.id, menuList);
      if (!draggedItem) return;
      if (draggedItem.type === "parent" && newParentId !== null) {
        return;
      }
      if (oldParentId === newParentId) {
        if (oldParentId === null) {
          const oldIndex = menuList.findIndex((x) => x.id === active.id);
          const newIndex = menuList.findIndex((x) => x.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return;
          const newMenu = arrayMove(menuList, oldIndex, newIndex);
          setMenuList(newMenu);
        } else {
          const parentIndex = menuList.findIndex((p) => p.id === oldParentId);
          if (parentIndex === -1) return;
          const children = menuList[parentIndex].children || [];
          const oldIndex = children.findIndex((c) => c.id === active.id);
          const newIndex = children.findIndex((c) => c.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return;
          const newChildren = arrayMove(children, oldIndex, newIndex);
          const updated = structuredClone(menuList);
          updated[parentIndex].children = newChildren;
          setMenuList(updated);
        }
      } else {
        const updatedMenu = structuredClone(menuList);
        removeItemFromMenu(updatedMenu, active.id, oldParentId);
        const draggedItem2 = getItemFromMenuList(active.id, menuList);
        if (!draggedItem2) return;
        insertItemInMenu(updatedMenu, draggedItem2, newParentId, over.id);
        setMenuList(updatedMenu);
      }
      return;
    }
    if (source === "TYPE_LIST" && target === "MAIN_MENU") {
      removeFromTypeList(active.id);
      const draggedItem = getItemFromTypeList(active.id);
      if (!draggedItem) return;
      const updatedMenu = structuredClone(menuList);
      insertItemInMenu(updatedMenu, draggedItem, newParentId, over.id);
      setMenuList(updatedMenu);
      return;
    }
    if (source === "MAIN_MENU" && target === "TYPE_LIST") {
      const draggedItem = getItemFromMenuList(active.id, menuList);
      if (draggedItem.type !== overData.allowedType) {
        return;
      }
      if (
        draggedItem.type === "parent" &&
        draggedItem.children &&
        draggedItem.children.length > 0
      ) {
        return;
      }
      const updatedMenu = structuredClone(menuList);
      removeItemFromMenu(updatedMenu, active.id, oldParentId);
      setMenuList(updatedMenu);
      if (!draggedItem) return;
      addToTypeList(draggedItem);
      return;
    }
  }

  function addLinkToMenu(title, url) {
    if (!title || !url) {
      return;
    }
    const newItem = {
      id: `menu-${Date.now()}`,
      title,
      url,
      type: "link",
    };
    setMenuList((prev) => [...prev, newItem]);
  }

  function addParentToMenu(parentTitle) {
    if (!parentTitle) {
      return;
    }
    const newParentItem = {
      id: `menu-${Date.now()}`,
      title: parentTitle,
      type: "parent",
      children: [],
    };
    setMenuList((prev) => [...prev, newParentItem]);
  }

  function deleteFromMenuAndBackToTypeList(itemId, parentId) {
    const draggedItem = getItemFromMenuList(itemId, menuList);
    if (!draggedItem) return;
    if (
      draggedItem.type === "parent" &&
      draggedItem.children &&
      draggedItem.children.length > 0
    ) {
      return;
    }
    const updatedMenu = structuredClone(menuList);
    removeItemFromMenu(updatedMenu, itemId, parentId);
    setMenuList(updatedMenu);
    addToTypeList(draggedItem);
  }

  return (
    <div className="flex flex-col h-screen">
      <p className="text-center p-4 text-3xl">Menu Bar</p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <main className="grid grid-cols-3 gap-4 w-full max-w-7xl mx-auto px-4 pb-4 min-h-0">
          <div className="col-span-1 border border-gray-500 rounded-lg px-4 py-2 h-fit">
            <TypeList
              items={typeList}
              onAddLinkToMenu={addLinkToMenu}
              onAddParentToMenu={addParentToMenu}
            />
          </div>
          <div className="col-span-2 border border-gray-500 rounded-lg p-4 overflow-y-auto h-full">
            <MainMenu
              items={menuList}
              onDeleteFromMenu={deleteFromMenuAndBackToTypeList}
            />
          </div>
        </main>
      </DndContext>
    </div>
  );
}
