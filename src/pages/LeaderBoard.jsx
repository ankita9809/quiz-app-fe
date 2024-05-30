import React, { useEffect, useState } from "react";
import auth from "../utils/auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../scomp/ui/table";
import { useSelector } from "react-redux";
import { Button } from "../scomp/ui/button";
import { useNavigate } from "react-router-dom";

export default function LeaderBoard() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const { _id } = useSelector((e) => e.userReducer.user);

  useEffect(() => {
    getLeaderBoard();
  }, []);

  const getLeaderBoard = async () => {
    try {
      const res = await auth.get("/view-scores");
      const data = await res.data;
      setList(data.result);
      // console.log(data.result);
    } catch (error) {}
  };

  const setHoverColor = (rank) => {
    if (rank === 1) return "hover:text-yellow-500";
    if (rank === 2) return "hover:text-gray-500";
    if (rank === 3) return "hover:text-amber-800";

    return "";
  };

  return (
    <div>
      <div className="flex w-full my-4  justify-between">
        <h1 className="text-center text-2xl ">Leader board</h1>
      </div>
      <Table>
        <TableCaption>
          Presented you The Kings and Queens of the Game.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] ">Name</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Total Quiz</TableHead>
            <TableHead className="text-right">Total Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list?.map((list) => (
            <TableRow
              key={list._id}
              className={
                setHoverColor(list.rank) +
                `${_id === list._id ? " text-green-700 " : " "}`
              }
            >
              <TableCell className={"font-medium "}>
                {list.name}{" "}
                <span className="">
                  {/* {_id === list._id ? "(You)" : ""} */}
                </span>
              </TableCell>
              <TableCell className="font-medium">{list.rank}</TableCell>
              <TableCell>{list.totalQuiz}</TableCell>
              <TableCell>{list.totalScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
