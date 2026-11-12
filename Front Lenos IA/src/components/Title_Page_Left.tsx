import React from "react";
import "./style/Title_Page_Left.css";

interface TitlePageLeftProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const Title_Page_Left: React.FC<TitlePageLeftProps> = ({title, subtitle, children}) => {
  return (
    <>
      <h1 className="page-title">{title}</h1>
      <h2 className="page-subtitle">{subtitle}</h2>
      {children}
    </>
  );
};

export default Title_Page_Left;
