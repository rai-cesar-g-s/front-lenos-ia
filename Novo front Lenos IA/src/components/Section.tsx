import React from 'react';

interface SectionProps {
    img: string;
    title: string;
    children?: React.ReactNode;
    update: string;
};

const Section: React.FC<SectionProps> = ({img, title, update, children}) => {
    return (
        <div className="page">
            <img>{img}</img>

            <title>{title}</title>

            {children}

            {update}
        </div>
    );
};

export default Section;