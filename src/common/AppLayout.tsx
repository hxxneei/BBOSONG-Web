import React from "react";
import BottomNav from "./BottomNav";

type Props = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <div className="app">
      <div className="app-content">
        {children}
        <div className="bottom-gap" />
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
