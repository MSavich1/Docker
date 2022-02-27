import "./App.css";
import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Forms } from "./components/Forms/Forms";
import { Login } from "./components/Login/Login";

function App() {
  const token = Boolean(localStorage.getItem("token"));
  const [_, setAuth] = useState(token)

  const component = token ? <Forms setAuth={setAuth}/> : <Login setAuth={setAuth} />
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={component} />
          <Route path="*" element={component} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

