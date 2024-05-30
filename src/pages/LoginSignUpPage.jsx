import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../scomp/ui/tabs";

export default function LoginSignUpPage() {
  const [selectedTab, setSelectedTab] = useState("login");

  return (
    <div className="h-[100vh] w-full flex justify-center items-center">
      <Tabs
        value={selectedTab}
        onValueChange={(s) => setSelectedTab(s)}
        defaultValue={selectedTab}
        className="flex p-5 flex-col justify-center max-w-[540px] border-[1px] rounded-2xl items-center"
      >
        <h1>
          {selectedTab === "login" ? "Welcome Back" : "Happy to Have You Here"}
        </h1>
        <p className="font-thin text-xs">
          {selectedTab === "login"
            ? "Welcome back! Please enter your details"
            : "Please enter your details"}
        </p>
        <div className="h-3" />
        <TabsList className="self-center">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup setSelectedTab={setSelectedTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
