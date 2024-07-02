export type UserCredentialsType = {
  isAuth: boolean;
  userId: undefined | string;
  name: undefined | string;
  bio: undefined | string;
  about: string | undefined;
  email: undefined | string;
  avatar: undefined | string;
  token: undefined | string;
  isLoading: boolean;
  totalPostsCount: number;
};

export type UserType = {
  about: string;
  avatar: string;
  bio: string;
  createdAt: string;
  email: string;
  name: string;
};

export type PostType = {
  id: string;
  title: string;
  content: string;
  previewImage: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  readTime: number;
  createdAt: string;
  tag: string;
};

export type FiveFollowingType = {
  id: string;
  name: string;
  avatar: string;
};

export type GetFollowersType = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
};
