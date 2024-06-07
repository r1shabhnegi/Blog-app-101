import { UserCredentialsType } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserCredentialsType = {
  isAuth: false,
  userId: null,
  name: null,
  email: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredentials: (state, { payload }) => {
      const { userId, name, email, token } = payload;
      state.isAuth = !!token && !!userId;
      state.userId = userId;
      state.name = name;
      state.email = email;
      state.token = token;
    },
    setLogout: (state) => {
      state.isAuth = false;
      state.userId = null;
      state.name = null;
      state.email = null;
      state.token = null;
    },
  },
});

export const { setUserCredentials, setLogout } = authSlice.actions;
export default authSlice.reducer;
