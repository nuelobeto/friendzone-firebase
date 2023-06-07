import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthLayout } from "../components/AuthLayout";
import { LoadingIcon } from "../components/icons";
import { Input } from "../components/input/Input";
import useAuth from "../store/useAuth";
import { Button } from "./../components/button/Button";

const ResetPassword = () => {
  const { loading, resetPassword } = useAuth((state) => state);
  const [password, setPassword] = useState("");

  const handleReset = () => {
    resetPassword(password);
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Please enter your new password below. Choose a strong and unique password to ensure the security of your account."
    >
      <AuthForm>
        <Input
          type={"password"}
          label={"New Password"}
          placeholder={"Enter your new password"}
          value={password}
          name={"password"}
          setValue={setPassword}
        />
        <Button
          children={
            !loading ? "Reset Password" : <LoadingIcon className="spinner" />
          }
          size={"lg"}
          variant={"filled"}
          rounded={"md"}
          color={"pry"}
          onClick={handleReset}
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

export default ResetPassword;

const AuthForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .alt-action {
    display: flex;
    justify-content: center;
    color: #c2c2c2;
    font-size: 13px;
    a {
      color: #ffd27d;
      font-weight: 600;
    }
  }
`;
