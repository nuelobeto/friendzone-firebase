import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import useAuth from "../store/useAuth";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const { user, error, message, resetAuth } = useAuth((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }
    navigate("/chats");
  }, [user]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      resetAuth();
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetAuth();
    }
  }, [error]);

  return (
    <AuthWrapper>
      <AuthMain>
        <AuthNav>
          <img src="/images/logo.png" alt="" /> <p>Friendzone</p>
        </AuthNav>
        <FormWrapper>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {children}
        </FormWrapper>
      </AuthMain>
      <AuthImg>
        <img src="/images/auth_image.jpg" alt="" />
      </AuthImg>
    </AuthWrapper>
  );
};

const AuthWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
`;

const AuthMain = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  flex-direction: column;
  position: relative;
`;

const AuthNav = styled.div`
  height: 8vh;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 1rem;

  img {
    height: 80%;
    object-fit: contain;
  }

  p {
    font-weight: 600;
    font-size: 22px;
  }
`;

const AuthImg = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  img {
    width: 100%;
    object-fit: contain;
  }

  @media (max-width: 1100px) {
    display: none;
  }
`;

const FormWrapper = styled.div`
  max-width: 380px;
  width: 100%;
  h1 {
    color: #1b1b1b;
    margin-bottom: 0.5rem;
  }
  p {
    color: #353535;
    margin-bottom: 2rem;
    font-size: 14px;
    font-weight: 400;
  }
`;
