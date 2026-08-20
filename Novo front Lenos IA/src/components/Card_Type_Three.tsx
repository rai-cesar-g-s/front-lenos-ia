import React from 'react';

interface CardTypeThreeProps {
    image: string;
    title: string;
    subtitle: string
    text: string;
    children?: React.ReactNode;
}

const Card_Type_Three: React.FC<CardTypeThreeProps> = ({image, title, subtitle, text, children}) => {
    return (
        <div className="card_type_three">
            <img>{image}</img>
            <h3>{title}</h3>
            <h4>{subtitle}</h4>
            {children}
            <p>{text}</p>
        </div>
    )
}

export default Card_Type_Three;