import React, { useEffect, useState } from "react";
import { Input } from "../scomp/ui/input";
import { Button } from "../scomp/ui/button";
import { Loader2, LogIn } from "lucide-react";
import axios from "axios";
import ENV from "../env";
import { useToast } from "../scomp/ui/use-toast";
import { ToastAction } from "../scomp/ui/toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slice/userSlice";
import { getUserInfo } from "./Header";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const URL = ENV.baseUrl + "/login";
      const data = {
        email: name,
        password,
      };
      let res = await axios.post(URL, data);
      let d = await res.data;
      let user = await getUserInfo(d.result.token);
      dispatch(setUser(user));
      toast({
        title: "Logged in Successfully",
        description: "Welcome to the Quiz App",
      });
      window.localStorage.setItem("jwt", d.result.token);

      navigate("/", { replace: true });
    } catch (error) {
      const msg = error.response.data.message;
      toast({
        variant: "destructive",
        title: msg,
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    const jwt = window.localStorage.getItem("jwt");
    if (jwt) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[300px] flex flex-col p-3 justify-center  rounded-lg"
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Email"
      />
      <div className="h-3" />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <div className="h-10" />

      <Button type="submit" variant="">
        {load ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-4 w-4" />
        )}
        Login
      </Button>
    </form>
  );
}
