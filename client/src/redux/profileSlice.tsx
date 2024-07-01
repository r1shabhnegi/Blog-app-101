import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    name: "",
    about: "",
    avatar: "",
    bio: "",
    numberOfPosts: "",
    totalFollowers: 0,
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

    setFollowerCount: (state, { payload }) => {
      state.totalFollowers = payload;
    },
  },
});

export const { setCurrentProfile, setFollowerCount } = profileSlice.actions;
export default profileSlice.reducer;
