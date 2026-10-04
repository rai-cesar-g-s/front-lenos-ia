import React from "react";
import { Link } from "react-router-dom";

// Estilização
import "./style/Button.css";

// Icons
import { IoMdArrowForward } from "react-icons/io";

interface ButtonProps {
  text: string;
  type: 1 | 2;
  link: string;
  image?: React.ReactNode;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ text, type, link, image }) => {
  const baseProps = {
    className: type === 1 ? "btn-one" : "btn-two",
  };

  return (
    <Link to={link} {...baseProps}>
      {image && <span>{image}</span>}
      {type === 1 && <IoMdArrowForward />}
      <span>{text}</span>
    </Link>
  );
};

export default Button;
