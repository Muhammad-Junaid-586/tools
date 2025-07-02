"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "./dataStore/store";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <Provider store={store}>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}