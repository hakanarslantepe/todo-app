"use client";

import { useState } from "react";
import Trash from "@/icons/Trash";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Edit from "@/icons/Edit";
import Check from "@/icons/Check";
import Link from "next/link";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (
    id: Id,
    content: string,
    description: string,
    color: string
  ) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [color, setColor] = useState(task.color || "blue");

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  const saveChanges = () => {
    updateTask(task.id, editedContent, editedDescription, color);
    toggleEditMode();
  };

  const getColorButtonClass = (buttonColor: string) => {
    return `h-5 w-5 rounded-full ${
      buttonColor === color ? "border-2 border-white" : ""
    }`;
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-green-500 p-2.5 h-[120px] min-h-[120px] items-center flex text-left rounded-xl border-2 border-blue-500  cursor-grab relative
      "
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-${color}-500 text-white p-2.5 h-[120px] min-h-[120px] items-center flex text-left rounded-lg hover:ring-2 hover:ring-inset hover:ring-red-500 cursor-grab relative`}
      >
        <div className="flex flex-col">
          <input
            className="w-full border-none rounded bg-transparent text-white focus:outline-none"
            value={editedContent}
            autoFocus
            placeholder="Task content here"
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <textarea
            className="w-full border-none rounded bg-transparent text-white focus:outline-none"
            value={editedDescription}
            placeholder="Task description here"
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <div className="flex flex-row gap-x-5">
            <button
              onClick={() => setColor("pink")}
              className={`bg-pink-500 ${getColorButtonClass("pink")}`}
            ></button>
            <button
              onClick={() => setColor("yellow")}
              className={`bg-yellow-500 ${getColorButtonClass("yellow")}`}
            ></button>
            <button
              onClick={() => setColor("blue")}
              className={`bg-blue-500 ${getColorButtonClass("blue")}`}
            ></button>
            <button
              onClick={() => setColor("purple")}
              className={`bg-purple-500 ${getColorButtonClass("purple")}`}
            ></button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center absolute right-2 top-2">
          <button
            onClick={saveChanges}
            className="stroke-black bg-green-500 text-white p-1 rounded opacity-60 hover:opacity-100"
          >
            <Check />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`text-white min-h-[72px] items-center bg-${task.color}-500 p-2.5 flex rounded-lg hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-grab relative`}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <Link href={`/${task.id}`}>
        <div className="flex flex-col gap-y-1">
          <p className="text-base font-bold">{task.content}</p>
          <p className="text-sm">{task?.description}</p>
        </div>
      </Link>

      {mouseIsOver && (
        <div className="flex flex-row gap-x-1 justify-center items-center absolute right-2 top-2">
          <button
            onClick={() => {
              deleteTask(task.id);
            }}
            className=" stroke-white  bg-red-500 p-1 rounded opacity-60 hover:opacity-100"
          >
            <Trash width={18} height={18} />
          </button>
          <button
            onClick={toggleEditMode}
            className="stroke-white bg-green-500 p-1 rounded opacity-90 hover:opacity-100"
          >
            <Edit width={18} height={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
