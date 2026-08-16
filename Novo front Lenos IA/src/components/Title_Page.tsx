import React from "react";

interface TitlePageProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const Title_Page: React.FC<TitlePageProps> = ({title, subtitle, children}) => {
  return (
    <>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      {children}
    </>
  );
};

export default Title_Page;
