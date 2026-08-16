import React from "react"

interface CardWrapperProps {
    title: string;
    text: string;
    children?: React.ReactNode;
}

const Card_Wrapper: React.FC<CardWrapperProps> = ({title, text, children}) => {
    return(
        <div className="card_wrapper">
            <h1>{title}</h1>
            <p>{text}</p>
            {children}
        </div>
    );
};

export default Card_Wrapper;