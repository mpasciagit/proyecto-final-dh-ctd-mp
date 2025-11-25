import React from "react";
import "../styles/layout.css";
import UserInfo from "./UserInfo";

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-left">
        <img src="/vite.svg" alt="Logo" className="header-logo" />
        <span className="header-appname">DriveNow</span>
      </div>
      <div className="header-center">
        Panel de Administración
      </div>
      <div className="header-right">
        <UserInfo />
      </div>
    </header>
  );
}
