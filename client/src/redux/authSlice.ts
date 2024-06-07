import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
  },
});

export const { setUserCredentials } = authSlice.actions;
export default authSlice.reducer;
