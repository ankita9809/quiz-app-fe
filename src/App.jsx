import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Input } from "./scomp/ui/input";
import Login from "./components/Login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./scomp/ui/tabs";
import Signup from "./components/Signup";
import LoginSignUpPage from "./pages/LoginSignUpPage";
import { Outlet, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./pages/ProtectedRoute";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import AnswerForm from "./pages/AnswerForm";
import Results from "./pages/Results";
import LeaderBoard from "./pages/LeaderBoard";
import { useDispatch } from "react-redux";
import { setToken } from "./redux/slice/userSlice";

const BasicLayout = () => {
  return (
    <>
      <div className="flex flex-col h-full w-full items-center ">
        <Header />
        <div className="flex-grow w-full h-full  flex flex-col items-center ">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToken(window.localStorage.getItem("jwt")));
  }, []);

  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route element={<BasicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/answers" element={<AnswerForm />} />
          <Route path="/results" element={<Results />} />
          <Route path="/leader-board" element={<LeaderBoard />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginSignUpPage />} />
    </Routes>
  );
}

export default App;
