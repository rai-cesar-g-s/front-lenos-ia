import React from 'react';

interface CardTypeOneProps {
    image: string;
    step: string;
    title: string;
    text: string;
    children?: React.ReactNode;
}

const Card_Type_One: React.FC<CardTypeOneProps> = ({image, title, step, text, children}) => {
    return (
        <div className="card_type_one">
            <img>{image}</img>
            <p>{step}</p>
            <h3>{title}</h3>
            <p>{text}</p>
            {children}
        </div>
    )
}

export default Card_Type_One;