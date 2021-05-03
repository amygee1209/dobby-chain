import React, { useState } from "react";
import './App.css';
import Content from "./components/Content";
import { ThemeProvider } from "styled-components";

const LightTheme = {
  pageBackground: "white",
  iconColor: "#FF7F50",
  textColor: "00ff92"
};

const DarkTheme = {
  pageBackground: "#151144",
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