export type UserCredentialsType = {
  isAuth: boolean;
  userId: undefined | string;
  name: undefined | string;
  bio: undefined | string;
  email: undefined | string;
  avatar: undefined | string;
  token: undefined | string;
  isLoading: boolean;
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
  title: string;
  content: string;
  previewImage: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  readTime: number;
  createdAt: string;
};
