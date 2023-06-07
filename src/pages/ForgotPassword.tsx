import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { AuthLayout } from "../components/AuthLayout";
import { LoadingIcon } from "../components/icons";
import { Input } from "../components/input/Input";
import useAuth from "../store/useAuth";
import { Button } from "./../components/button/Button";

const ForgotPassword = () => {
  const { loading, sendPasswordResetLink } = useAuth((state) => state);
  const [email, setEmail] = useState("");

  const handleResetLink = () => {
    sendPasswordResetLink(email);
  };

  return (
    <AuthLayout
      title="Forgot Your password?"
      subtitle="Enter your email below. We will send a reset password link."
    >
      <AuthForm>
        <Input
          type={"email"}
          label={"Email"}
          placeholder={"Enter your Email"}
          value={email}
          name={"email"}
          setValue={setEmail}
        />
        <Button
          children={
            !loading ? "Send Reset Link" : <LoadingIcon className="spinner" />
          }
          size={"lg"}
          variant={"filled"}
          rounded={"md"}
          color={"pry"}
          onClick={handleResetLink}
        />
        <div className="alt-action">
          <p>
            Already have an account? <Link to={"/login"}>Log in</Link>
          </p>
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default ForgotPassword;

const AuthForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .alt-action {
    display: flex;
    justify-content: center;
    color: #000;
    font-size: 13px;
    a {
      color: #1ba0dd;
      font-weight: 600;
    }
  }
`;
