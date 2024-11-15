import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setAuthenticated } from "../feature/authSlice";

type PhoneNumber = string | null;

//profile of user

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState<PhoneNumber>(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userPhone = currentUser.phoneNumber;
      if (userPhone) {
        setPhoneNumber(userPhone);
      }
    }
  }, [currentUser, dispatch]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("phoneNumber");
      navigate("/");
      toast.success("Logged out successfully.");
      localStorage.removeItem("isLogin");
      dispatch(setAuthenticated(true));
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <img
        src="/assets/logo.png"
        alt="Logo"
        className="absolute top-10 right-10 w-16 h-16"
      />
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {phoneNumber ? phoneNumber : "Loading..."}
        </h2>
        <button
          onClick={handleLogout}
          className="mt-4 px-8 py-2 w-80 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
