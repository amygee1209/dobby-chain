import React, { useState } from "react";
import './App.css';
import Content from "./components/Content";
import { ThemeProvider } from "styled-components";

const LightTheme = {
  pageBackground: "white",
  iconColor: "#FF7F50",
  textColor: "black"
};

const DarkTheme = {
  pageBackground: "#282c36",
  iconColor: "#FF7F50",
  textColor: "lavender"
}

const themes = {
  light: LightTheme,
  dark: DarkTheme,
}


export default function App() {
  //dark & light
  const [theme, setTheme] = useState("light");

  return (
    <ThemeProvider theme={themes[theme]}>
      <Content theme={theme} setTheme={setTheme} />
    </ThemeProvider>
  );
}