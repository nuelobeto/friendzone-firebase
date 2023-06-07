import styled from "styled-components";
import useAuth from "../store/useAuth";
import { Button } from "./button/Button";
import { SearchIcon } from "./icons";
import { useEffect, useState } from "react";
import {
  ref as dbRef,
  set,
  child,
  get,
  onValue,
  push,
  onChildAdded,
  onChildChanged,
} from "firebase/database";
import { database } from "../config/firebase";
import { ChatT, UserT } from "../types/types";
import useChat from "../store/useChat";

type SidebarProps = {
  showChatArea: boolean;
  setShowChatArea: React.Dispatch<React.SetStateAction<boolean>>;
  viewportWidth: number;
};

const Sidebar = ({ setShowChatArea, viewportWidth }: SidebarProps) => {
  const { user, logout } = useAuth((state) => state);
  const { setChat } = useChat((state) => state);
  const [allUsers, setAllUsers] = useState<UserT[]>([]);
  const [chats, setChats] = useState<ChatT[]>([]);
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    setChat(null);
    logout();
  };

  const getUsers = async () => {
    const res = dbRef(database, "users");
    let array: UserT[] = [];

    onValue(
      res,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          array.push(childData);
          setAllUsers(array);
        });
      },
      {
        onlyOnce: true,
      }
    );
  };

  const getChats = async () => {
    const res = dbRef(database, "chats");
    let array: ChatT[] = [];

    onValue(
      res,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          array.push(childData);
          if (user) {
            const userChats = array.filter((chat) =>
              chat.chatId.includes(user?.id)
            );
            setChats(userChats);
          }
        });
      },
      {
        onlyOnce: true,
      }
    );
  };

  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  const startChat = async (friendId: string) => {
    const chatId = `${user?.id}+${friendId}`;
    const reversedChatId = `${friendId}+${user?.id}`;
    const userB = await get(child(dbRef(database), `users/${friendId}`));
    const userA = await get(child(dbRef(database), `users/${user?.id}`));

    const chat: ChatT = {
      chatId,
      userA: {
        id: userA?.val()?.id,
        avatar: userA?.val()?.avatar,
        username: userA?.val()?.username,
      },
      userB: {
        id: userB?.val()?.id,
        avatar: userB?.val()?.avatar,
        username: userB?.val()?.username,
      },
      lastMessage: "",
    };

    const existingChat = await get(child(dbRef(database), `chats/${chatId}`));
    const reversedExistingChat = await get(
      child(dbRef(database), `chats/${reversedChatId}`)
    );

    if (existingChat.exists() || reversedExistingChat.exists()) {
      localStorage.setItem(
        "chat",
        JSON.stringify(existingChat.val() || reversedExistingChat.val())
      );
      setChat(existingChat.val() || reversedExistingChat.val());
    } else {
      set(dbRef(database, "chats/" + chatId), chat);
      localStorage.setItem("chat", JSON.stringify(chat));
      setChat(chat);
    }

    setQuery("");
    getChats();

    viewportWidth < 700 ? setShowChatArea(true) : setShowChatArea(false);
  };

  const getFriend = (chat: ChatT) => {
    const friend = chat?.userA?.id === user?.id ? chat?.userB : chat?.userA;
    return friend;
  };

  useEffect(() => {
    getUsers();
    getChats();
  }, []);

  useEffect(() => {
    const chatsRef = dbRef(database, `chats`);
    onChildAdded(chatsRef, (data) => {
      getChats();
    });
    onChildChanged(chatsRef, (data) => {
      getChats();
    });
  }, []);

  return (
    <SidebarWrapper>
      <Topbar>
        <img src={user?.avatar} alt="" />
        <Button
          size={"sm"}
          variant={"filled"}
          rounded={"sm"}
          color={"pry"}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Topbar>

      <Search>
        <div>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </Search>

      <Chats className="hide-scroll">
        {!query
          ? chats.map((chat, index) => (
              <div
                className="chat"
                key={index}
                onClick={() => startChat(getFriend(chat).id)}
              >
                <img src={getFriend(chat).avatar} alt="" />
                <div>
                  <span className="name">{getFriend(chat).username}</span>
                  <p className="last-msg">
                    {chat.lastMessage.text}{" "}
                    {chat.lastMessage.image && (
                      <img
                        src={chat.lastMessage.image}
                        alt=""
                        style={{
                          display: "inline",
                          width: "20px",
                          borderRadius: "0px",
                        }}
                      />
                    )}
                  </p>
                </div>
                <span className="time">{chat.lastMessage.time}</span>
              </div>
            ))
          : filteredUsers.map((user, index) => (
              <div
                className="chat"
                key={index}
                onClick={() => startChat(user.id)}
              >
                <img src={user?.avatar} alt="" />
                <div>
                  <span className="name">{user?.username}</span>
                </div>
              </div>
            ))}
      </Chats>
    </SidebarWrapper>
  );
};

export default Sidebar;

const SidebarWrapper = styled.div`
  width: 35%;
  height: 100%;
  border-right: 2px solid #e7ebec;

  @media (max-width: 900px) {
    width: 350px;
    /* width: 100%; */
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const Topbar = styled.div`
  height: 8vh;
  width: 100%;
  border-bottom: 2px solid #e7ebec;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: #f8f7f7;

  img {
    height: 75%;
    object-fit: contain;
    border-radius: 50%;
  }
`;

const Search = styled.div`
  height: 8vh;
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;

  & > div {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    border: 2px solid #e7ebec;
    border-radius: 8px;
    padding-left: 0.75rem;
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

    svg {
      color: #9c9e9e;
      font-size: 25px;
    }
  }
`;

const Chats = styled.div`
  width: 100%;
  height: calc(100% - 16vh);
  overflow: auto;
  padding: 1rem;

  .chat {
    width: 100%;
    display: flex;
    gap: 1rem;
    padding: 0.75rem;
    cursor: pointer;
    border-radius: 8px;

    &:hover {
      background-color: #f8f7f7;
    }

    img {
      width: 50px;
      height: fit-content;
      aspect-ratio: 1/1;
      object-fit: contain;
      border-radius: 50%;
    }

    & > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      overflow-x: hidden;

      .name {
        font-weight: 600;
      }
      .last-msg {
        font-size: 14px;
        white-space: nowrap;
        color: gray;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .time {
      width: fit-content;
      font-size: 12px;
    }
  }
`;
