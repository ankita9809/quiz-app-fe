import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAllTopics,
  setCurrentTopic,
  setIsRandom,
} from "../redux/slice/topicsSlice";
import { Button } from "../scomp/ui/button";
import { Checkbox } from "../scomp/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../scomp/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../scomp/ui/select";
import { useToast } from "../scomp/ui/use-toast";

const Items = ({ label, id, checked, onCheckedChange }) => {
  return (
    <div className="flex items-center space-x-2 my-2">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} id={id} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
};

export function ChooseTopics({ triggerClass, ...props }) {
  const { topics } = useSelector((e) => e.topicsReducer);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [curIndex, setCurIndex] = useState(0);

  const [selectedValue, setSelectedValue] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const nextFunction = () => {
    if (curIndex === 0) {
      if (selectedTopics.length < 2) {
        return toast({
          variant: "destructive",
          title: "Select atleast two topic ",
        });
      }
    }
    if (curIndex === 1) {
      if (!selectedValue)
        return toast({
          variant: "destructive",
          title: "Select atleast one topic or go with mixed questions",
        });
      dispatch(setCurrentTopic(selectedValue));
      dispatch(setIsRandom(false));
      navigate("/answers", {
        state: {
          fromSelect: true,
          isRandom: false,
          currentTopics: selectedValue,
        },
      });
    } else {
      setCurIndex((e) => e + 1);
    }
  };

  const mixedQuestions = () => {
    dispatch(setIsRandom(true));
    dispatch(setAllTopics(selectedTopics.map((e) => e._id)));
    navigate("/answers", {
      state: {
        fromSelect: true,
        isRandom: true,
        allTopics: selectedTopics.map((e) => e._id),
      },
    });
  };

  return (
    <Dialog
      onOpenChange={() => {
        setCurIndex(0);
        setSelectedTopics([]);
      }}
    >
      <DialogTrigger asChild>
        <Button className={triggerClass ? triggerClass : ""} variant="outline">
          {props.children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {curIndex === 0 ? (
          <>
            <DialogHeader>
              <DialogTitle>Choose Topics</DialogTitle>
              <DialogDescription>
                Select all the topics you wish to challenge
              </DialogDescription>
            </DialogHeader>
            <div>
              {topics?.map((e, i) => (
                <Items
                  checked={selectedTopics.map((e) => e._id).includes(e._id)}
                  onCheckedChange={() => {
                    setSelectedTopics((s) => {
                      let isItThere = selectedTopics
                        .map((e) => e._id)
                        .includes(e._id);
                      if (isItThere) {
                        let newThere = [];
                        for (let i = 0; i < s.length; i++) {
                          if (e._id === s[i]._id) {
                          } else {
                            newThere.push(s[i]);
                          }
                        }
                        return newThere;
                      }
                      return [...s, e];
                    });
                  }}
                  key={e._id}
                  id={e._id}
                  label={e.topicName}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Choose Type</DialogTitle>
              <DialogDescription>
                Select How you want to take your quiz
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full justify-between">
              <Button
                onClick={mixedQuestions}
                className="border w-[180px]"
                variant="ghost"
              >
                Mixed Questions
              </Button>
              <Select onValueChange={(e) => setSelectedValue(e)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Topic</SelectLabel>
                    {selectedTopics.map((e) => (
                      <SelectItem key={e._id} value={e._id}>
                        {e.topicName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <DialogFooter>
          <Button onClick={nextFunction} type="submit">
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
