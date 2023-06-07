import styled from "styled-components";

type FileInputT = {
  image?: any;
  icon?: React.ReactNode;
  text?: string;
  setFile: React.Dispatch<React.SetStateAction<any>>;
};

export const FileInput = ({ image, text, icon, setFile }: FileInputT) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0]);
  };

  return (
    <InputWrapper>
      <label htmlFor="file">
        {icon}
        {image && <img src={image} alt="" />}
        {text && <span>{text}</span>}
      </label>
      <input type="file" id="file" onChange={handleChange} />
    </InputWrapper>
  );
};

const InputWrapper = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 14px;

    img {
      display: block;
      width: 40px;
    }

    span {
      color: #353535;
    }
  }

  input {
    display: none;
  }
`;
