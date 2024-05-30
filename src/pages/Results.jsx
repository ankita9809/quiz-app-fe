import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../scomp/ui/table";
import auth from "../utils/auth";
export default function Results() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    viewResultsList();
  }, []);

  const viewResultsList = async () => {
    try {
      const res = await auth.get("/view-result-list");
      const data = await res.data;
      setResults(data.result);
    } catch (error) {
      // console.log(error);
    }
  };

  const answerView = (id) => {
    navigate("/answers", {
      state: {
        fromAllResult: true,
        id,
      },
    });
  };

  return (
    <div className="my-5 overflow-auto">
      <h1 className="text-center text-2xl">
        List of all the quiz you attended
      </h1>
      <Table className="">
        <TableCaption>A List of all the quiz you attended</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Topics</TableHead>
            <TableHead>Total questions</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((invoice, index) => (
            <TableRow
              onClick={() => answerView(invoice._id)}
              className="hover:cursor-pointer"
              key={invoice._id}
            >
              <TableCell className="font-medium">
                {invoice.topic?.map((e, i) => {
                  return <p key={index + e + i}>{e}</p>;
                })}
              </TableCell>
              <TableCell>{invoice.total}</TableCell>
              <TableCell>{invoice.score}</TableCell>
              <TableCell className="text-right">
                {moment(invoice.submittedOn).format("Do MMMM YYYY")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
