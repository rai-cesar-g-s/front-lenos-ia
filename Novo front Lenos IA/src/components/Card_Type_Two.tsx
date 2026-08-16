import React from 'react';

interface CardTypeTwoProps {
    image: string;
    title: string;
    text: string;
    children?: React.ReactNode;
}

const Card_Type_Two: React.FC<CardTypeTwoProps> = ({image, title, text, children}) => {
    return (
        <div className="card_type_two">
             <img>{image}</img>
             <h3>{title}</h3>
             <p>{text}</p>
             {children}
        </div>
    )
}

export default Card_Type_Two;