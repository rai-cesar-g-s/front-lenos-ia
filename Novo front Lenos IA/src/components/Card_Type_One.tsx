import React from "react";
import "./style/Card_Type_One.css";

interface CardTypeOneProps {
  image?: React.ReactNode;
  step: string;
  title: string;
  text: string;
  children?: React.ReactNode;
}

const Card_Type_One: React.FC<CardTypeOneProps> = ({
  image,
  title,
  step,
  text,
  children,
}) => {
  return (
    <div className="card_type_one">
      <div className="card-image">{image}</div>
      <p>{step}</p>
      
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
};

export default Card_Type_One;
