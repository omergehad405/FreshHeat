import React, { useEffect, useState } from "react";
import {
  FaUserAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import { auth, db } from "/src/Config/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { MdPayments } from "react-icons/md";
import PaymentPage from "./PaymentPage";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("info");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          const additionalData = userDocSnap.exists() ? userDocSnap.data() : {};

          setUserData({
            name: additionalData.name || user.displayName || "No Name",
            email: user.email,
            phone: additionalData.phone || "No phone number",
          });
        } catch (error) {
          console.error("Error fetching Firestore data:", error.message);
        } finally {
          setLoading(false);
        }
      } else {
        // المستخدم مش مسجل دخول
        setLoading(false);
        setUserData(null);
        window.location.href = "/login"; // redirect على صفحة تسجيل الدخول
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setUserData(null);
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        Loading profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        حدث خطأ: لم يتم العثور على بيانات المستخدم.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row items-start justify-center px-6 py-10 gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-6">
        <img
          src="https://www.w3schools.com/howto/img_avatar.png"
          alt="User Avatar"
          className="w-28 h-28 rounded-full border-4 border-[var(--main)] shadow-md"
        />
        <button
          onClick={() => setActiveSection("info")}
          className={`w-full py-2 rounded-md font-semibold transition ${
            activeSection === "info"
              ? "bg-black text-white"
              : "bg-red-500 text-white hover:bg-black"
          }`}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveSection("payment")}
          className={`w-full py-2 rounded-md font-semibold flex items-center justify-center gap-2 transition ${
            activeSection === "favorites"
              ? "bg-black text-white"
              : "bg-red-500 text-white hover:bg-black"
          }`}
        >
          <MdPayments /> Payment
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-8">
        {activeSection === "info" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Profile Information
            </h2>
            <div className="flex items-center gap-3 text-gray-700 mb-4">
              <FaUserAlt className="text-[var(--main)]" />
              <span className="text-lg">{userData.name}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 mb-4">
              <FaPhoneAlt className="text-[var(--main)]" />
              <span className="text-lg">{userData.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <FaEnvelope className="text-[var(--main)]" />
              <span className="text-lg">{userData.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-[150px] mt-5 py-2 cursor-pointer rounded-md font-semibold flex items-center justify-center gap-2 transition bg-red-500 text-white hover:bg-black"
            >
              Logout
            </button>
          </>
        )}

        {activeSection === "favorites" && (
          <div className="text-center text-gray-600 text-lg">
            <p>No favorite items yet.</p>
          </div>
        )}

        {activeSection === "payment" && <PaymentPage />}
      </div>
    </div>
  );
}

export default Profile;
{
  /* <div className="text-center text-gray-600 text-lg">
  <p>No favorite items yet.</p>
</div> */
}
