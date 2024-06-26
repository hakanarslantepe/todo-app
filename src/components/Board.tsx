"use client";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Trash from "@/icons/Trash";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import Plus from "@/icons/Plus";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (
    id: Id,
    content: string,
    description: string,
    color: string
  ) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

function Board({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      opacity-40
      border-2
      border-blue-500
      w-[350px]
      h-[700px]
      max-h-[700px]
      rounded-md
      flex
      flex-col
      bg-green-500
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
      bg-slate-900
  w-[350px]
  h-[700px]
  rounded-lg
  flex
  flex-col
  border-2
  border-blue-500
  text-white
  "
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
        bg-slate-900
        text-white
      text-3xl
      h-[80px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      border-blue-500
      border-b-2
      flex
      items-center
      justify-between
      "
      >
        <div className="flex gap-2">
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-slate-700 text-white focus:border-blue-500 border rounded outline-none px-2 py-1 w-[260px]"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="
        stroke-slate-500
        hover:stroke-white
        hover:bg-red-500
        rounded
        px-1
        py-2
        "
        >
          <Trash width={25} height={25} />
        </button>
      </div>

      <div className="flex flex-grow flex-col w-full gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        className="flex gap-2 items-center border-blue-500 border-t-2 rounded-md p-4  hover:bg-slate-700 hover:text-blue-500 font-bold active:bg-blue-500 active:text-white"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <Plus />
        New task
      </button>
    </div>
  );
}

export default Board;
