import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
  );
}

export default App;
