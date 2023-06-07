import styled from "styled-components";

type InputProps = {
  label?: string;
  placeholder?: string;
  type: string;
  value: any;
  name: string;
  setValue?: React.Dispatch<React.SetStateAction<any>>;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  leftIcon?: any;
  rightIcon?: any;
  handleClick?: () => void;
};

export const Input = (props: InputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.setFormData) {
      props.setFormData((prevState: any) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    } else if (props.setValue) {
      props.setValue(event.target.value);
    }
  };

  return (
    <FormGroup leftIcon={props.leftIcon}>
      {props.label && <label>{props.label}</label>}
      <div className="input-wrapper">
        {props.leftIcon && <button>{props.leftIcon}</button>}
        <input
          type={props.type}
          placeholder={props.placeholder}
          name={props.name}
          value={props.value}
          onChange={handleChange}
        />
        {props.rightIcon && <button>{props.rightIcon}</button>}
      </div>
    </FormGroup>
  );
};

const FormGroup = styled.div<any>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 14px;
    color: #1b1b1b;
    font-weight: 500;
  }

  .input-wrapper {
    width: 100%;
    display: flex;
    height: 43px;
    align-items: center;

    input {
      width: 100%;
      height: 43px;
      outline: none;
      border: 2px solid #666666;
      border-radius: 8px;
      padding: ${(props) => (props.leftIcon ? "59px" : "1rem")};
      background-color: transparent;
      color: #000;
      font-size: 15px;

      &:focus {
        border: 2px solid #1ba0dd;
      }
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
