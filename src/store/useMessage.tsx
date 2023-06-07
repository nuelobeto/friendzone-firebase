import { create } from "zustand";
import { MessageT } from "../types/types";

type MessageStateT = {
  messages: MessageT[];
  setMessages: (messages: MessageT[]) => void;
};

const useMessage = create<MessageStateT>((set) => ({
  messages: [],

  setMessages: (messages: MessageT[]) => {
    set((state) => ({ messages: (state.messages = messages) }));
  },
}));

export default useMessage;
