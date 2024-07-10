import { ProfileType } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProfileType = {
  name: undefined,
  about: undefined,
  avatar: undefined,
  bio: undefined,
  numberOfPosts: 0,
  totalFollowers: 0,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setCurrentProfile: (state, { payload }) => {
      const { name, about, avatar, bio, numberOfPosts } = payload;
      state.name = name;
      state.about = about;
      state.avatar = avatar;
      state.bio = bio;
      state.numberOfPosts = +numberOfPosts;
    },

    setFollowerCount: (state, { payload }) => {
      state.totalFollowers = payload;
    },
  },
});

export const { setCurrentProfile, setFollowerCount } = profileSlice.actions;
export default profileSlice.reducer;
