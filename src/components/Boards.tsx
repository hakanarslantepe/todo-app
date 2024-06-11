"use client";

import Plus from "@/icons/Plus";
import { useMemo, useState, useEffect } from "react";
import { Column, Id, Task } from "../types";
import Board from "./Board";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { child, get, ref, remove, set, update } from "firebase/database";
import { db } from "../../firebase";

const Boards = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const getTasks = async () => {
    try {
      const snapshot = await get(child(ref(db), "tasks"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTasks(Object.values(data));
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getColumns = async () => {
    try {
      const snapshot = await get(child(ref(db), "boards"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setColumns(Object.values(data));
      } else {
        console.log("no data available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTasks();
    getColumns();
  }, []);

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
      color: "blue",
      description: `Task ${tasks.length + 1} description`,
    };

    setTasks([...tasks, newTask]);

    set(ref(db, `tasks/${newTask.id}`), newTask)
      .then(() => {
        console.log("New task added to Firebase");
      })
      .catch((error) => {
        console.error("Error adding new task to Firebase:", error);
      });
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    remove(ref(db, `tasks/${id}`))
      .then(() => {
        console.log(`Task ${id} deleted successfully from Firebase`);
      })
      .catch((error) => {
        console.error(`Error deleting task ${id} from Firebase:`, error);
      });
  }

  function updateTask(
    id: Id,
    content: string,
    description: string,
    color: string
  ) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content, description, color };
    });

    setTasks(newTasks);
    const taskRef = ref(db, `tasks/${id}`);
    update(taskRef, { content, description, color })
      .then(() => {
        console.log(`Task ${id} updated successfully in Firebase`);
      })
      .catch((error) => {
        console.error(`Error updating task ${id} in Firebase:`, error);
      });
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);

    set(ref(db, `boards/${columnToAdd.id}`), columnToAdd)
      .then(() => {
        console.log("New column added to Firebase");
      })
      .catch((error) => {
        console.error("Error adding new column to Firebase:", error);
      });
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);

    remove(ref(db, `boards/${id}`))
      .then(() => {
        console.log(`Column ${id} deleted successfully from Firebase`);
      })
      .catch((error) => {
        console.error(`Error deleting column ${id} from Firebase:`, error);
      });
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
    const columnRef = ref(db, `boards/${id}`);
    update(columnRef, { title })
      .then(() => {
        console.log(`Column ${id} updated successfully in Firebase`);
      })
      .catch((error) => {
        console.error(`Error updating column ${id} in Firebase:`, error);
      });
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        const taskRef = ref(db, `tasks/${activeId}`);
        update(taskRef, { columnId: overId })
          .then(() => {
            console.log(
              `Task ${activeId} columnId updated successfully in Firebase`
            );
          })
          .catch((error) => {
            console.error(
              `Error updating task ${activeId} columnId in Firebase:`,
              error
            );
          });

        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  return (
    <div
      className="
      mx-auto
      flex
      w-full
      items-center
      overflow-x-auto
      px-[40px]
      h-screen"
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <Board
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="
      h-[80px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-slate-900
      text-white
      border-2
      border-blue-500
      p-4
      ring-blue-500
      hover:ring-2
      hover:text-blue-500
      hover:border-0
      hover:bg-slate-700
      active:bg-blue-500
      active:text-white
      flex
      gap-2
      font-bold
      items-center
      justify-center
      "
          >
            <Plus />
            New Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Board
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default Boards;
