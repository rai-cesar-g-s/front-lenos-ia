import React from 'react';
import "./style/Terms.css";

interface TermsProps {
    title: string;
    description: string;
    children?: React.ReactNode;
};

const Terms: React.FC<TermsProps> = ({title, description, children}) => {
    return (
        <div className="terms">
            <h3>{title}</h3>
            <p>{description}</p>

            {children}
        </div>
    );
};

export default Terms;