import { Loader2, SendHorizontal } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserInfo } from "../components/Header";
import { selectToken, setUser } from "../redux/slice/userSlice";
import store from "../redux/store/store";
import { Button } from "../scomp/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../scomp/ui/dialog";
import { Label } from "../scomp/ui/label";
import { RadioGroup, RadioGroupItem } from "../scomp/ui/radio-group";
import auth from "../utils/auth";

const QuestionAndAnswer = ({ item, qNo, onSelect, onClear }) => {
  const {
    question,
    optionOne,
    optionTwo,
    optionThree,
    optionFour,
    _id,
    optedAns,
    correctAnswer,
  } = item;
  // console.log(item._id);
  let isFeedBackMode = optedAns || correctAnswer ? true : false;
  return (
    <div className="my-4 border-b">
      <h1>{qNo + ".  " + question}</h1>
      <RadioGroup
        onValueChange={(e) => {
          // console.log(">>>>id ,e", _id, e, item);
          onSelect(_id, e);
        }}
        className="mt-4"
        defaultValue=""
        value={isFeedBackMode ? optedAns : item?.option || ""}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={optionOne} id={optionOne + _id} />
          <Label htmlFor={optionOne + _id}>{optionOne}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={optionTwo} id={optionTwo + _id} />
          <Label htmlFor={optionTwo + _id}>{optionTwo}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={optionThree} id={optionThree + _id} />
          <Label htmlFor={optionThree + _id}>{optionThree}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={optionFour} id={optionFour + _id} />
          <Label htmlFor={optionFour + _id}>{optionFour}</Label>
        </div>
      </RadioGroup>
      {isFeedBackMode ? (
        <p
          className={
            correctAnswer === optedAns
              ? "text-green-400" + " my-4"
              : "text-red-400" + " my-4"
          }
        >
          Correct Answer : {correctAnswer}
        </p>
      ) : (
        <div className="my-4">
          <Button onClick={() => onClear(_id)}>Clear</Button>
        </div>
      )}
    </div>
  );
};

export default function AnswerForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const [result, setResult] = useState(0);
  const [resultMode, setResultMode] = useState(false);
  const [load, setLoad] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  const dispatch = useDispatch();

  // console.log(questions);
  const onClear = (id) => {
    setQuestions((e) => {
      let a = e.map((s) => {
        if (s._id === id) {
          return { ...s, option: "" };
        } else {
          return s;
        }
      });
      return a;
    });
  };

  const onSelect = (id, option) => {
    setQuestions((e) => {
      let a = e.map((s) => {
        if (s._id === id) {
          return { ...s, option };
        } else {
          return s;
        }
      });
      return a;
    });
  };

  const { loading, topics, currentTopics, allTopics } = useSelector(
    (e) => e.topicsReducer
  );
  const getQuestions = useCallback(async () => {
    if (location.state.isRandom) {
      try {
        const res = await auth.post("/get-random-qns", {
          topics: location.state.allTopics,
        });

        const data = await res.data;
        setQuestions(data.result);
      } catch (error) {
        // console.log(error);
      }
    } else {
      try {
        const res = await auth.get(`/get-qns/${location.state.currentTopics}`);

        const data = await res.data;
        setQuestions(data.result);
      } catch (error) {
        // console.log(error);
      }
    }
  }, []);

  const firstRenderRef = useRef(false);

  const viewResponse = useCallback(async () => {
    const url = `/view-response/${location.state.id}`;
    try {
      const res = await auth.get(url);
      const data = await res.data;
      // console.log(data.result);
      setQuestions(data.result.resp);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!location.state?.fromSelect && !location.state?.fromAllResult) {
      return navigate("/", { replace: true });
    }

      if (location.state?.fromAllResult) {
        viewResponse();
      } else {
        getQuestions();
      }
  
  }, [getQuestions, viewResponse]);

  const submitAnswers = async () => {
    if (!load) {
      setLoad(true);
      try {
        const response = questions.map((e) => {
          return { questionId: e._id, option: e?.option || "" };
        });
        const topic = location.state?.currentTopics
          ? [location.state?.currentTopics]
          : location.state.allTopics;

        const res = await auth.post("/submit-quiz", {
          topics: topic,
          response,
        });
        const scoreRes = await auth.get("/view-score");
        setResult(await scoreRes.data.result);
        setResultOpen(true);
        const user = await getUserInfo(selectToken(store.getState()));
        dispatch(setUser(user));
        // console.log(scoreRes);
        // console.log(await res.data);
      } catch (error) {
        // console.log(error);
      } finally {
        setLoad(false);
      }
    } else {
    }
  };

  const onGoHome = () => {
    navigate("/", { replace: true });
  };

  const onViewFeedback = async () => {
    try {
      const res = await auth.get("/view-response");
      const data = await res.data;
      setQuestions(data.result.resp);
      setResultOpen(false);
      setResultMode(true);
      // console.log(res);
    } catch (error) {
    } finally {
    }
  };

  return (
    <div className="overflow-y-auto">
      {questions.map((e, i) => (
        <QuestionAndAnswer
          item={e}
          key={e._id}
          qNo={i + 1}
          onSelect={onSelect}
          onClear={onClear}
        />
      ))}
      {resultMode ? (
        <Button
          className="w-[180px] hover:bg-slate-200"
          variant={"secondary"}
          onClick={onGoHome}
        >
          Go Home
        </Button>
      ) : location.state.fromAllResult && questions.length ? (
        <Button
          className="w-[180px] hover:bg-slate-200"
          variant={"secondary"}
          onClick={() => navigate("/results")}
        >
          Go To All Results
        </Button>
      ) : questions.length ? (
        <Button onClick={submitAnswers} className="mr-auto">
          {load ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <SendHorizontal className="mr-2 h-4 w-4" />
          )}
          Submit Answers
        </Button>
      ) : null}
      <Dialog open={resultOpen}>
        <DialogContent noClose>
          <DialogHeader>
            <DialogTitle>Thank you </DialogTitle>
            <DialogDescription>
              Your Current Quiz score is {result}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-around w-full">
            <Button
              className="w-[180px] hover:bg-slate-200"
              variant={"secondary"}
              onClick={onGoHome}
            >
              Go Home
            </Button>
            <Button onClick={onViewFeedback} className="w-[180px] ">
              View Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
