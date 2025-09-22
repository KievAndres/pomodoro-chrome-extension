import { useState } from "react";
import "./App.css";
import TimerPage from "./pages/TimerPage/TimerPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="chrome-extension-container">
      <TimerPage />
    </div>
  );
}

export default App;
