import { createSlice } from "@reduxjs/toolkit";
import { LoginResponse } from "./types/loginUser";
export type UserTypeName = "SERVER" | "DEVELOPER" | "CONSUMER" | "";
type LocalStorageUser = {
  user: LoginResponse | null;
  token: string | null;
  userTypeName: UserTypeName;
};

const initialState: LocalStorageUser = {
  user: null,
  token: null,
  userTypeName: "",
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload || {};

      if (!user || !token) {
        console.error("Invalid payload received:", action.payload);
        return;
      }

      state.token = token;
      state.user = user;
    },
    setUserTypeName: (state, action) => {
      state.userTypeName = action.payload;
    },
    clearUserTypeName: (state) => {
      state.userTypeName = "";
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setUserTypeName, clearUserTypeName, logout } =
  authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
