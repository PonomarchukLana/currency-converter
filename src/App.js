import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const ConverterPage = lazy(() => import("./views/ConverterPage"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConverterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
