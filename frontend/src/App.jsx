import { useState } from "react";
import "./App.css";

import Navbar from "./components/common/Navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <div className="bg-richblack-900 min-h-screen">

      <div>
          <Navbar />
      </div>
    </div>
    </>
  );
}

export default App;
