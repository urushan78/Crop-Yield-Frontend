import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import HistoricalData from "./pages/HistoricalData/HistoricalData";
import GraphView from "./pages/GraphView/GraphView";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/historical-data" element={<HistoricalData />} />
          <Route exact path="/graph-view" element={<GraphView />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
