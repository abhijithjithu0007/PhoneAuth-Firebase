import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import VerifyOtp from "./components/VerifyOtp";
import { Provider } from "react-redux";
import store from "./store";
import RegisterUser from "./components/RegisterUser";
import Profile from "./components/Profile";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Toaster />
    </Provider>
  );
};

export default App;
