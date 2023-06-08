import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useAuth from "../store/useAuth";
import useChat from "../store/useChat";
import { AttachIcon, SendIcon } from "./icons";
import {
  ref as dbRef,
  set,
  child,
  get,
  push,
  onChildAdded,
  getDatabase,
} from "firebase/database";
import { database, storage } from "../config/firebase";
import { MessageT } from "../types/types";
import { FileInput } from "./input/FileInput";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useMessage from "../store/useMessage";
import { Button } from "./button/Button";

type ChatAreaProps = {
  showChatArea: boolean;
  setShowChatArea: React.Dispatch<React.SetStateAction<boolean>>;
};

type FriendProps = {
  id: string;
  avatar: string;
  username: string;
};

const ChatArea = ({ showChatArea, setShowChatArea }: ChatAreaProps) => {
  const { user } = useAuth((state) => state);
  const { chat, setChat } = useChat((state) => state);
  const [friend, setFriend] = useState<null | FriendProps>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<any | null>(null);
  const { messages, setMessages } = useMessage((state) => state);
  const containerRef = useRef<HTMLDivElement>(null);

  const getFriend = () => {
    const friend = chat?.userA?.id === user?.id ? chat?.userB : chat?.userA;
    if (friend) {
      setFriend(friend);
    }
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      const storageRef = ref(storage, `${file?.name}`);
      let url = null;

      if (file) {
        await uploadBytes(storageRef, file);
        url = await getDownloadURL(storageRef);
      }

      const message: MessageT = {
        text,
        file: file ? url : null,
        senderId: user?.id || "",
        chatId: chat?.chatId || "",
      };

      const time = Date.now();
      const timeString = new Date(time).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const chatUpdate = {
        ...chat,
        lastMessage: {
          text: text,
          image: url ? "/images/add-image.png" : null,
          time: timeString,
        },
      };

      const messageRef = push(
        child(dbRef(database), `messages/${chat?.chatId}`)
      );
      await set(messageRef, message);

      set(dbRef(database, `chats/${chat?.chatId}`), chatUpdate);

      getMessages();
      setText("");
      setFile(null);
    }
  };

  const getMessages = async () => {
    setMessages([]);
    const Ref = dbRef(getDatabase());
    get(child(Ref, `messages/${chat?.chatId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setMessages(Object.values(snapshot.val()));
        } else {
          setMessages([]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const closeChat = () => {
    setShowChatArea(false);
    localStorage.removeItem("chat");
    setChat(null);
    setFriend(null);
  };

  useEffect(() => {
    if (!chat) {
      return;
    } else {
      getFriend();
      getMessages();
    }
  }, [chat]);

  useEffect(() => {
    const messagesRef = dbRef(database, `messages/${chat?.chatId}`);
    onChildAdded(messagesRef, (data) => {
      getMessages();
    });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ChatAreaWrapper show={showChatArea}>
      <Topbar>
        {friend && (
          <div className="friend">
            <img src={friend?.avatar} alt="" />
            <span>{friend?.username}</span>
          </div>
        )}

        {chat && (
          <Button
            size={"sm"}
            variant={"filled"}
            rounded={"sm"}
            color={"pry"}
            style={{ minWidth: "99.63px" }}
            onClick={closeChat}
          >
            Close Chat
          </Button>
        )}
      </Topbar>

      <Messages ref={containerRef} className="hide-scroll">
        {messages.map((message, index) => (
          <div
            className={`message ${friend?.id === message.senderId ? "" : "me"}`}
            key={index}
          >
            {message.text && (
              <p style={{ marginBottom: `${message.file && "5px"}` }}>
                {message.text}
              </p>
            )}
            {message.file && <img src={message.file} />}
          </div>
        ))}
      </Messages>

      <SendMessage onSubmit={handleSendMessage}>
        <div className="send-message">
          <FileInput icon={<AttachIcon />} setFile={setFile} />
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button>
            <SendIcon style={{ color: "#1ba0dd" }} />
          </button>
        </div>
        {file && <div className="file">{file.name}</div>}
      </SendMessage>
    </ChatAreaWrapper>
  );
};

export default ChatArea;

const ChatAreaWrapper = styled.div<any>`
  flex: 1;
  height: 100%;
  position: relative;

  @media (max-width: 700px) {
    width: 100%;
    display: ${(props) => (props.show ? "block" : "none")};
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const Topbar = styled.div`
  height: 63.11px;
  width: 100%;
  border-bottom: 2px solid #e7ebec;
  background-color: #f8f7f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  gap: 1rem;
  position: absolute;
  top: 0;
  left: 0;

  @media (max-width: 700px) {
    position: fixed;
    top: 0;
    left: 0;
  }

  .friend {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow-x: hidden;

    img {
      height: 75%;
      aspect-ratio: 1/1;
      object-fit: cover;
      border-radius: 50%;
    }

    span {
      white-space: nowrap;
    }
  }
`;

const Messages = styled.div`
  width: 100%;
  height: calc(100% - 126.22px);
  background: linear-gradient(88.16deg, #d8d8d8 23.58%, #cccbcb 96.8%),
    url("/images/chat-bg.jpg");
  background-blend-mode: multiply;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: auto;
  margin-top: 63.11px;

  @media (max-width: 700px) {
    height: calc(100% - 63.11px);
    padding-bottom: calc(63.11px + 1rem);
  }

  .message {
    max-width: 90%;
    width: fit-content;
    height: fit-content;
    background-color: #fff;
    padding: 0.5rem;
    border-radius: 8px;
    font-size: 14px;
    color: #000;

    &.me {
      align-self: flex-end;
      background-color: #1ba0dd;
      color: #fff;
    }

    img {
      max-width: 300px;
      width: 100%;
      aspect-ratio: 1/1;
      object-fit: cover;
      cursor: pointer;
      border-radius: 8px;
    }
  }
`;

const SendMessage = styled.form`
  height: 63.11px;
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  background-color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;

  @media (max-width: 700px) {
    position: fixed;
    bottom: 0;
    left: 0;
  }

  .send-message {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    border: 2px solid #e7ebec;
    border-radius: 8px;
    padding: 0 0.75rem;
    overflow: hidden;
    background-color: #e7ebec;

    input {
      flex: 1;
      height: 100%;
      border: none;
      outline: none;
      font-size: 15px;
      padding-left: 0.75rem;
      background-color: transparent;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background-color: transparent;
    }

    svg {
      color: #9c9e9e;
      font-size: 25px;
      cursor: pointer;

      &:hover {
        color: #1ba0dd;
      }
    }
  }

  .file {
    position: absolute;
    bottom: calc(100% + 5px);
    left: 5px;
    background-color: #61727a;
    padding: 0.5rem;
    border-radius: 6px;
    font-size: 11px;
    color: #fff;
    z-index: 10;
  }
`;
