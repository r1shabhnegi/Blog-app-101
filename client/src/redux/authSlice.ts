import { UserCredentialsType } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserCredentialsType = {
  isAuth: false,
  userId: null,
  name: null,
  email: null,
  avatar: null,
  token: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredentials: (state, { payload }) => {
      const { userId, name, email, avatar, token } = payload;
      state.isAuth = !!token && !!userId;
      state.userId = userId;
      state.name = name;
      state.email = email;
      state.avatar = avatar;
      state.token = token;
    },
    setLogout: (state) => {
      state.isAuth = false;
      state.userId = null;
      state.name = null;
      state.email = null;
      state.token = null;
    },
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
});

export const { setUserCredentials, setLogout, setLoading } = authSlice.actions;
export default authSlice.reducer;
