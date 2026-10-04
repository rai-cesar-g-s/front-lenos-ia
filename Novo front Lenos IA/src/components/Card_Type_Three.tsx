import React from 'react';
import "./style/Card_Type_Three.css";

interface CardTypeThreeProps {
    image?: React.ReactNode;
    title: string;
    subtitle: string
    text: string;
    children?: React.ReactNode;
}

const Card_Type_Three: React.FC<CardTypeThreeProps> = ({image, title, subtitle, text, children}) => {
    return (
        <div className="card_type_three">
            <div className="card-image">{image}</div>
            <h3>{title}</h3>
            <h4>{subtitle}</h4>
            {children}
            <p>{text}</p>
        </div>
    )
}

export default Card_Type_Three;