import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  id: null,
  name: null,
  email: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserCredentials: (state, { payload }) => {
      const { isAuth, id, name, email, token } = payload;
      state.isAuth = isAuth;
      state.id = id;
      state.name = name;
      state.email = email;
      state.token = token;
    },
  },
});

export const { setUserCredentials } = authSlice.actions;
export default authSlice.reducer;

export const authSelector =  