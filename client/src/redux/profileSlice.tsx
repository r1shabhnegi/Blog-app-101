import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    name: "",
    about: "",
    avatar: "",
    bio: "",
    numberOfPosts: "",
  },
  reducers: {
    setCurrentProfile: (state, { payload }) => {
      const { name, about, avatar, bio, numberOfPosts } = payload;
      state.name = name;
      state.about = about;
      state.avatar = avatar;
      state.bio = bio;
      state.numberOfPosts = numberOfPosts;
    },
  },
});

export const { setCurrentProfile } = profileSlice.actions;
export default profileSlice.reducer;
