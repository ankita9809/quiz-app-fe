import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  token: "",
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      // console.log(">>>>>>>>>setuser", payload);
      state.user = payload;
    },
    setToken: (state, { payload }) => {
      // console.log(">>>>>>>>>setuser", payload);
      state.token = payload;
    },
  },
});

export const { setUser, setToken } = userSlice.actions;

const userReducer = userSlice.reducer;
export const selectToken = (state) => {
  return state.userReducer.token;
};
export default userReducer;
