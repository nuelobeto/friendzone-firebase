import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthLayout } from "../components/AuthLayout";
import { LoadingIcon } from "../components/icons";
import { Input } from "../components/input/Input";
import useAuth from "../store/useAuth";
import { LoginT } from "../types/types";
import { Button } from "./../components/button/Button";

const Login = () => {
  const { loading, login, googleAuth } = useAuth((state) => state);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    const payload: LoginT = {
      email: formData.email,
      password: formData.password,
    };

    login(payload);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your account.">
      <AuthForm>
        <Input
          type={"email"}
          label={"Email"}
          placeholder={"Enter your Email"}
          value={formData.email}
          name={"email"}
          setFormData={setFormData}
        />
        <Input
          type={"password"}
          label={"Password"}
          placeholder={"Enter your Password"}
          value={formData.password}
          name={"password"}
          setFormData={setFormData}
        />
        <div className="forgot-pass-wrapper">
          <Link to={"/forgot-password"}>Forgot Password?</Link>
        </div>
        <Button
          children={!loading ? "Log In" : <LoadingIcon className="spinner" />}
          size={"lg"}
          variant={"filled"}
          rounded={"md"}
          color={"pry"}
          onClick={handleLogin}
        />
        <Button
          children={"Sign in with Google"}
          size={"lg"}
          variant={"filled"}
          rounded={"md"}
          color={"pry"}
          style={{ background: "#1a1a1a", borderColor: "#1a1a1a" }}
          leftIcon={
            <img src="https://res.cloudinary.com/dk9bt9lkn/image/upload/v1682165401/scheduly/google_wfnuko.png" />
          }
          onClick={googleAuth}
        />
        <div className="alt-action">
          <p>
            Don't have an account? <Link to={"/signup"}>Sign up</Link>
          </p>
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default Login;

const AuthForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .forgot-pass-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    a {
      color: #1ba0dd;
      font-size: 14px;
    }
  }

  .alt-action {
    display: flex;
    justify-content: center;
    color: #c2c2c2;
    font-size: 13px;
    a {
      color: #1ba0dd;
      font-weight: 600;
    }
  }
`;
