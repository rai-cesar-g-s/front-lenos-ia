import React from "react";
import { useState } from "react";
import "./style/Card_Wrapper.css";

interface CardWrapperProps {
    title: string;
    text: string;
    children?: React.ReactNode;
}

const Card_Dropdown: React.FC<CardWrapperProps> = ({title, text, children}) => {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className={`Card_Dropdown${isOpen ? " is-open" : ""}`}>
            <button
                type="button"
                className="dropdown-trigger"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <span className="dropdown-icon" aria-hidden="true">⌄</span>
            </button>
            {isOpen && <p>{text}</p>}
            {children}
        </div>
    );
};

export default Card_Dropdown;