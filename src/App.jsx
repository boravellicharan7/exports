import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./HOME/Landing";
import AuthPage from "./LOGIN&REGISTER/Auth"
import Transport from "./TRANSPORT/Transport"
import ShippingBookingForm from "./TRANSPORT/Ship"
import UserProfilePage from "./Profile/Profile";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Login&Registration" element={<AuthPage />} />
          <Route path="/Transport" element={<Transport />} />
          <Route path="/Bookings" element={<ShippingBookingForm />} />
          <Route path="/profilepage" element={<UserProfilePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
