import React from 'react';
import "./style/Card_Type_Four.css";

interface CardTypeFourProps {
    title: string;
    text: string;
    children?: React.ReactNode;
}

const Card_Type_Four: React.FC<CardTypeFourProps> = ({title, text, children}) => {
    return (
        <div className="card_type_four">
            <h3>{title}</h3>
            <p>{text}</p>
            {children}
        </div>
    )
}

export default Card_Type_Four;