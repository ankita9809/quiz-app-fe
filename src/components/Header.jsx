import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slice/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../scomp/ui/avatar";
import auth from "../utils/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../scomp/ui/tooltip";
import { Button } from "../scomp/ui/button";
import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const getFirstletter = (str) => {
  if (str) {
    return str[0].toLocaleUpperCase();
  } else {
    return "QA";
  }
};

export const getUserInfo = async (token) => {
  try {
    const res = await auth.get("/get-user-info");
    const data = await res.data;
    const user = { ...data.result, token };
    return user;
  } catch (error) {
    // console.log(error);
  }
};

export default function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // const user = JSON.parse(window.localStorage.getItem("user"));
    setUserData();
  }, []);

  const setUserData = async () => {
    const user = await getUserInfo(window.localStorage.getItem("jwt"));
    dispatch(setUser(user));
  };

  const { email, mobile, name, rank } = useSelector((e) => e.userReducer.user);

  const setRankClass = (rank) => {
    // if (rank === 1) {
    //   return "bg-[#E5B80B]";
    // } else if (rank === 2) {
    //   return "bg-[#C0C0C0]";
    // } else if (rank === 3) {
    //   return "bg-[#3d7f32]";
    // } else {
    return "";
    // }
  };

  const logout = () => {
    window.localStorage.clear();
    window.location = "/login";
  };

  console.log(location);

  return (
    <div className="rounded-full inset-x-0 max-w-2xl mx-auto z-50 top-2 border flex flex-row justify-center items-center  bg-white px-8  mt-5 ">
      {location.pathname !== "/" && (
        <Button
          variant="secondary"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
      )}
      <nav className="relative rounded-full boder border-transparent dark:bg-black dark:border-white/[0.2]shadow-input flex justify-center space-x-4 py-6  ">
        <div className="relative ">
          <p
            className={
              "cursor-pointer text-black hover:opacity-[0.9] dark:text-white rounded-sm px-4 " +
              setRankClass(rank || 0)
            }
          >
            {rank ? `Rank ${rank}` : "No rank yet"}
          </p>
        </div>
      </nav>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="self-center ml-5 hover:cursor-pointer">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-white">
                {getFirstletter(name)}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>Name : {name}</p>
            <p>Email : {email}</p>
            <p>Mobile : {mobile}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={logout} variant="ghost" className="ml-4">
              <LogOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
