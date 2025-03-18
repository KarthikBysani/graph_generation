import React, { useState } from "react";
import QueryInput from "./components/QueryInput";
import GraphTypeSelector from "./components/GraphTypeSelector";
import Graphs from "./components/Graphs";
// import "./styles/styles.css";

const App = () => {
  const [sqlQuery, setSQLQuery] = useState("");
  const [graphType, setGraphType] = useState("");

  return (
    <div className="App">
      <h1>Interactive Data Visualization</h1>
      <QueryInput onSQLGenerated={setSQLQuery} />
      {sqlQuery && <GraphTypeSelector graphType={graphType} onSelectGraphType={setGraphType} />}
      {graphType && <Graphs graphType={graphType} />}
    </div>
  );
};

export default App;
