import React from 'react';
import "./style/Section.css";

interface SectionProps {
    image?: React.ReactNode;
    title: string;
    children?: React.ReactNode;
    update: string;
};

const Section: React.FC<SectionProps> = ({image, title, update, children}) => {
    return (
        <div className="page">
            <div className="section-image">{image}</div>

            <title>{title}</title>

            {children}

            <p className="section-update">{update}</p>
        </div>
    );
};

export default Section;