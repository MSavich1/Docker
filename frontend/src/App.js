import "./App.css";
import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Forms } from "./components/Forms/index";
import { Login } from "./components/Login/index";
import { TOKEN } from "./constants";

function App() {
  const token = Boolean(localStorage.getItem(TOKEN));
  const [, setAuth] = useState(token)

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

