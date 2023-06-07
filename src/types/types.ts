export type SignupT = {
  email: string;
  password: string;
  username: string;
  avatar: any;
};

export type LoginT = {
  email: string;
  password: string;
};

export type UserT = {
  id: string;
  token: string;
  email: string;
  username: string;
  avatar: string;
};

export type ChatT = {
  chatId: string;
  userA: {
    id: string;
    avatar: string;
    username: string;
  };
  userB: {
    id: string;
    avatar: string;
    username: string;
  };
  lastMessage: any;
};

export type MessageT = {
  chatId: string;
  text?: string;
  file?: string | null;
  senderId: string;
};
