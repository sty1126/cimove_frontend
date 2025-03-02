import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="flex">
        <Sidebar />
      </div>
      <div className="content"> </div>
    </Router>
  );
}

export default App;
