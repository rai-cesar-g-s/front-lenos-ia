import React from "react";
import "./style/Title_Page_Middle.css";

interface TitlePageMiddleProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const Title_Page_Middle: React.FC<TitlePageMiddleProps> = ({title, subtitle, children}) => {
  return (
    <>
      <h1 className="page-title">{title}</h1>
      <h2 className="page-subtitle">{subtitle}</h2>
      {children}
    </>
  );
};

export default Title_Page_Middle;
