import React, { useEffect } from "react";
import { Button } from "../scomp/ui/button";
import auth from "../utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { getTopics } from "../redux/slice/topicsSlice";
import { ChooseTopics } from "../components/ChooseTopics";
import { AlertDialog, AlertDialogTrigger } from "../scomp/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getTopics());
  }, []);

  const { topics } = useSelector((e) => e.topicsReducer);
  // console.log(">>> ", topics);

  return (
    <div className="w-full max-w-2xl flex flex-col justify-center items-center h-full">
      <h1 className="text-center mb-10 text-4xl">Welcome to the Quiz App</h1>
      <div className="flex justify-between w-full mb-11">
        <Button
          onClick={() => navigate("/leader-board")}
          className="flex-1 h-48  "
          variant={""}
        >
          Leader Board
        </Button>
        <div className="w-3" />

        <ChooseTopics triggerClass={"flex-1 h-48"}>Start a Quiz</ChooseTopics>
        <div className="w-3" />
        <Button
          onClick={() => navigate("/results")}
          className="flex-1 h-48"
          variant={""}
        >
          Results
        </Button>
      </div>

      <div className="flex w-full justify-between flex-col">
        <h1 className="text-center mb-10 ">Topics</h1>
        <div>
          {topics?.map((e, i) => {
            return (
              <Button
                key={e._id}
                className={" mx-1 my-2"}
                variant={i % 2 === 0 ? "secondary" : ""}
              >
                {e.topicName}
              </Button>
            );
          })}
        </div>
        <ChooseTopics triggerClass={"border my-5"}>Start a Quiz</ChooseTopics>
      </div>
    </div>
  );
}
