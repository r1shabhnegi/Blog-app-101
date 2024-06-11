import { UserCredentialsType } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserCredentialsType = {
  isAuth: false,
  userId: undefined,
  name: undefined,
  bio: undefined,
  email: undefined,
  avatar: undefined,
  token: undefined,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredentials: (state, { payload }) => {
      const { userId, name, email, avatar, token, bio } = payload;
      state.isAuth = !!token && !!userId;
      state.userId = userId;
      state.name = name;
      state.email = email;
      state.avatar = avatar;
      state.token = token;
      state.bio = bio;
    },
    setLogout: (state) => {
      state.isAuth = false;
      state.userId = undefined;
      state.name = undefined;
      state.email = undefined;
      state.token = undefined;
      state.bio = undefined;
    },
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
});

export const { setUserCredentials, setLogout, setLoading } = authSlice.actions;
export default authSlice.reducer;
