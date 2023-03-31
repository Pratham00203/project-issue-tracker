import showPasswordImg from "../assets/images/password.png";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { isExpired } from "react-jwt";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const { email, token } = useParams();
  const navigate = useNavigate();

  const password = useRef();

  useEffect(() => {
    if (token) {
      if (isExpired(token)) {
        navigate("/verify-email/change-password");
      }
    } else {
      navigate("/verify-email/change-password");
    }

    //eslint-disable-next-line
  }, []);

  const handleSubmit = () => {
    if (password.current.value.trim() === "") {
      toast.error("Password cannot be empty");
    } else {
      changePassword();
    }
  };

  const changePassword = async () => {
    try {
      let res = await axios({
        method: "put",
        url: "https://trackify-backend.onrender.com/api/auth/change-password",
        data: {
          email: email,
          password: password.current.value,
        },
        headers: {
          "x-auth-token": token,
        },
      });

      toast.success(res.data.msg);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <div className='wrapper-container d-flex align-center'>
        <div className='change-password-modal verification-modal d-flex justify-center align-center'>
          <h2>Change Password</h2>
          <p>
            By clicking submit, you are sure confirming to change your password.
          </p>
          <div className='form'>
            <div className='input_field password_field'>
              <img
                className='show_password'
                onClick={() => setShowPassword(!showPassword)}
                src={showPasswordImg}
                alt=''
              />
              <label htmlFor='password' className='custom_input'>
                <input
                  type={showPassword ? "text" : "password"}
                  name='password'
                  placeholder='Password'
                  ref={password}
                />

                <p className='custom_label'>Password</p>
              </label>
            </div>
            <button
              type='button'
              onClick={handleSubmit}
              style={{ marginTop: "40px" }}>
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
