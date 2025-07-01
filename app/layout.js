import React from "react";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./globals.css";

// Importing the Inter font and specifying subsets
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Medicine",
  description: "No need to leave home for medicine anymore",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Include the Inter font styles */}
        <style>{inter.css}</style>
      </head>
      <body className={inter.className}>
        {/* Render the children components */}
        {children}
        {/* Add the ToastContainer for toast notifications */}
        <ToastContainer />
      </body>
    </html>
  );
}
