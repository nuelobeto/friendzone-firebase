import { create } from "zustand";
import { ChatT } from "../types/types";

type ChatStateT = {
  chat: ChatT | null;
  setChat: (chat: ChatT | null) => void;
};

const savedChat: string | null = localStorage.getItem("chat");
const parsedChat: ChatT | undefined = savedChat
  ? JSON.parse(savedChat)
  : undefined;

const useChat = create<ChatStateT>((set) => ({
  chat: parsedChat ? parsedChat : null,

  setChat: (chat: ChatT | null) => {
    set((state) => ({ chat: (state.chat = chat) }));
  },
}));

export default useChat;
