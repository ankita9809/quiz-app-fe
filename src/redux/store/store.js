import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import topicsReducer from "../slice/topicsSlice";

const reducer = {
    userReducer,
    topicsReducer
}

const store = configureStore({
    reducer,
})


export default store;