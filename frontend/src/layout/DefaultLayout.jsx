import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./partials/Header.comp";
import { Footer } from "./partials/Footer.comp";

export const DefaultLayout = () => {
  return (
    <div className="default-layout">
      <header className="header shadow-sm mb-2">
        <Header />
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer mt-auto">
        <Footer />
      </footer>
    </div>
  );
};
