import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Network from "./pages/Network";
import QuestionFeed from "./pages/QuestionFeed";
import CreateQuestion from "./pages/CreateQuestion";
import QuestionDetail from "./pages/QuestionDetail";

function App() {
  return (
    <Router>
      <RoutesContainer />
    </Router>
  );
}

const RoutesContainer = () => {
  const location = useLocation();
  const hideNavbarPages = ["/login", "/register"]; // Add other paths if needed
  const showNavbar = !hideNavbarPages.includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/network" element={<Network />} />
        <Route path="/questions" element={<QuestionFeed />} />
        <Route path="/questions/create" element={<CreateQuestion />} />
        <Route path="/questions/:questionId" element={<QuestionDetail />} />
      </Routes>
    </div>
  );
};

export default App;
