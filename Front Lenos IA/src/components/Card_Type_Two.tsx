import React from 'react';
import "./style/Card_Type_Two.css";

interface CardTypeTwoProps {
    image?: React.ReactNode;
    title: string;
    text: string;
    children?: React.ReactNode;
}

const Card_Type_Two: React.FC<CardTypeTwoProps> = ({image, title, text, children}) => {
    return (
        <div className="card_type_two">
             <div className="card-image">{image}</div>
             <h3>{title}</h3>
             <p>{text}</p>
             {children}
        </div>
    )
}

export default Card_Type_Two;