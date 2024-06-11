"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import chevronup from "@/assets/chevron-up.png";
import chevrondown from "@/assets/chevron-down.png";
import home from "@/assets/home.png";
import close from "@/assets/close.png";
import share from "@/assets/share.png";
import star from "@/assets/star.png";
import dots from "@/assets/dots.png";
import TaskDetail from "@/components/TaskDetail";
import { child, get, ref } from "firebase/database";
import { db } from "../../../firebase";
import { Task } from "@/types";
import { useParams } from "next/navigation";
import Link from "next/link";

const TaskPage = () => {
  const [task, setTask] = useState<Task | null>(null);

  const { taskId } = useParams();

  const getTask = () => {
    get(child(ref(db), `tasks/${taskId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setTask(data);
        } else {
          console.log("no data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (taskId) {
      getTask();
    }
  }, [taskId]);

  return (
    <>
      <div className="h-16 bg-slate-900  flex justify-between flex-row items-center px-8">
        <div className="flex flex-row gap-x-4 justify-center items-center">
          <div className="h-5 w-5">
            <Image src={chevronup} alt="" className="white-icon" />
          </div>
          <div className="h-5 w-5">
            <Image
              src={chevrondown}
              alt=""
              className="white-icon"
              width={20}
              height={20}
            />
          </div>
          <Link href="/">
            <div className="h-5 w-5">
              <Image
                src={home}
                alt=""
                width={20}
                height={20}
                className="white-icon"
              />
            </div>
          </Link>

          <div className="flex flex-row gap-x-4 justify-center items-center">
            <span className="text-xl text-white">{">"}</span>
            <p className="text-white text-sm font-medium">Projects</p>
            <span className="text-xl text-white">{">"}</span>
            <p className="text-white text-sm font-bold">Proje Name 1</p>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row gap-x-4 justify-center items-center relative">
            <div className="h-5 w-5 cursor-pointer">
              <Image src={dots} alt="" className="white-icon" />
            </div>
            <div className="h-5 w-5">
              <Image
                src={share}
                alt=""
                width={20}
                height={20}
                className="white-icon"
              />
            </div>
            <div className="h-5 w-5">
              <Image
                src={star}
                alt=""
                width={20}
                height={20}
                className="white-icon"
              />
            </div>
            <Link href="/">
              <div className="h-5 w-5 cursor-pointer">
                <Image
                  src={close}
                  alt=""
                  width={20}
                  height={20}
                  className="white-icon"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-row">{task && <TaskDetail task={task} />}</div>
    </>
  );
};

export default TaskPage;
