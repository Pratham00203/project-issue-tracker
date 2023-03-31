import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../assets/images/logo.png";
import profileImg from "../../assets/images/profile-pic.jpg";
import UserContext from "../../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("click", handleMenu);

    function handleMenu(e) {
      if (e.target === document.querySelector(".profile_photo")) {
        if (
          document.querySelector(".logout-menu").classList.contains("active")
        ) {
          document.querySelector(".logout-menu").classList.remove("active");
        } else {
          document.querySelector(".logout-menu").classList.add("active");
        }
      } else {
        document.querySelector(".logout-menu").classList.remove("active");
      }
    }

    return () => {
      window.removeEventListener("click", handleMenu);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const checkOrganization = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "https://trackify-backend.onrender.com/api/organization/check-existence",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      navigate("/organization/create");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <nav className='d-flex align-center'>
      <h1>
        <Link to='/projects/dashboard' className='logo d-flex align-center'>
          <img src={logoImg} alt='' />
          trackify
        </Link>
      </h1>

      <div
        className='d-flex justify-center align-center'
        style={{ gap: "10px" }}>
        <p style={{ color: "rgb(7, 71, 166)" }}>{user.name}</p>
        <img className='profile_photo' src={profileImg} alt='' />
      </div>
      <div className='logout-menu d-flex'>
        <p>
          <Link to='/projects/dashboard'>My Projects</Link>
        </p>
        <p>
          <Link to='/my-organization'>My Organization</Link>
        </p>
        <p onClick={checkOrganization}>Create Organization</p>
        <hr />
        <p style={{ color: "rgb(226, 6, 6)" }} onClick={logout}>
          Sign out
        </p>
      </div>
    </nav>
  );
}
