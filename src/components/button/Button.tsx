import styled from "styled-components";

type ButtonProps = {
  children: React.ReactNode;
  size: "xs" | "sm" | "md" | "lg";
  variant: "outlined" | "filled";
  rounded: "sm" | "md" | "lg" | "full";
  color: "pry" | "white";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: any;
  onClick?: () => void;
};

export const Button = (props: ButtonProps) => {
  return (
    <ButtonWrapper
      size={props.size}
      rounded={props.rounded}
      variant={props.variant}
      color={props.color}
      style={props.style}
      onClick={props.onClick}
    >
      {props.leftIcon} {props.children} {props.rightIcon}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.button<any>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  padding: ${(props) =>
    props.size === "xs"
      ? "5px 12px"
      : props.size === "sm"
      ? "8px 14px"
      : props.size === "md"
      ? "10px 16px"
      : props.size === "lg"
      ? "12px 20px"
      : "10px 16px"};
  border-radius: ${(props) =>
    props.rounded === "sm"
      ? "4px"
      : props.rounded === "md"
      ? "8px"
      : props.rounded === "lg"
      ? "12px"
      : props.rounded === "full"
      ? "999px"
      : "8px"};
  ${(props) =>
    props.variant === "outlined"
      ? `
      border: 1px solid ${props.color === "pry" ? "#1ba0dd" : "white"};
      background-color: transparent;
      color: ${props.color === "pry" ? "#1ba0dd" : "white"};
    `
      : `
      border: 1px solid ${props.color === "pry" ? "#1ba0dd" : "white"};
      background-color: ${props.color === "pry" ? "#1ba0dd" : "white"};
      color: ${props.color === "pry" ? "white" : "#1ba0dd"};
    `}

  svg {
    font-size: 20px;
  }

  img {
    height: 22px;
  }
`;
