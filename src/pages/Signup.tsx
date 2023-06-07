import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { AuthLayout } from "../components/AuthLayout";
import { LoadingIcon } from "../components/icons";
import { FileInput } from "../components/input/FileInput";
import { Input } from "../components/input/Input";
import useAuth from "../store/useAuth";
import { SignupT } from "../types/types";
import { Button } from "./../components/button/Button";

const Signup = () => {
  const { loading, signup, googleAuth } = useAuth((state) => state);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [image, setImage] = useState<any | null>(null);

  const handleSignup = () => {
    const payload: SignupT = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      avatar: image,
    };

    signup(payload);
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Connect with friends anywhere, everywhere."
    >
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
          type={"text"}
          label={"Username"}
          placeholder={"Enter your Username"}
          value={formData.username}
          name={"username"}
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
          <FileInput
            image={"/images/add-image.png"}
            text={image !== null ? image.name : "Add an Avatar"}
            setFile={setImage}
          />
        </div>
        <Button
          children={!loading ? "Sign Up" : <LoadingIcon className="spinner" />}
          size={"lg"}
          variant={"filled"}
          rounded={"md"}
          color={"pry"}
          onClick={handleSignup}
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
            Already have an account? <Link to={"/login"}>Log in</Link>
          </p>
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default Signup;

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
