import styled from "styled-components";
import Sidebar from "./../components/Sidebar";
import ChatArea from "./../components/ChatArea";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const [showChatArea, setShowChatArea] = useState(false);
  const [viewportWidth, setviewPortWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setviewPortWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
  }, [viewportWidth]);

  useEffect(() => {
    if (viewportWidth > 700) {
      setShowChatArea(false);
    }
  }, [viewportWidth]);

  return (
    <MainWrapper>
      <ChatLayout>
        <Sidebar
          showChatArea={showChatArea}
          setShowChatArea={setShowChatArea}
          viewportWidth={viewportWidth}
        />
        <ChatArea
          showChatArea={showChatArea}
          setShowChatArea={setShowChatArea}
        />
      </ChatLayout>
    </MainWrapper>
  );
};

export default ChatPage;

const MainWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #d7dbdb;
  padding: 1rem 0;

  @media (max-width: 1500px) {
    padding: 0;
  }
`;

const ChatLayout = styled.div`
  max-width: 1500px;
  width: 100%;
  height: 100%;
  background-color: #fff;
  margin: auto;
  border-radius: 16px;
  display: flex;
  overflow: hidden;

  @media (max-width: 1500px) {
    border-radius: 0;
  }
`;
