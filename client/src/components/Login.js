import showPasswordImg from "../assets/images/password.png";
import logoImg from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import checkAuth from "../helpers/auth";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const email = useRef();
  const password = useRef();

  const checkLoginDetails = (e) => {
    e.preventDefault();
    let emailField = email.current.value;
    let passwordField = password.current.value;

    if (emailField.trim() === "" || passwordField.trim() === "") {
      toast.error("All fields are required!");
    } else {
      login();
    }
  };

  const login = async () => {
    try {
      const res = await axios({
        method: "post",
        url: "https://trackify-backend.onrender.com/api/auth/login",
        data: {
          email: email.current.value,
          password: password.current.value,
        },
      });

      localStorage.setItem("token", res.data.token);
      if (checkAuth()) {
        navigate("/projects/dashboard");
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <div className='login-container d-flex justify-center align-center'>
        <div className='login-form'>
          <h1 className='logo d-flex align-center justify-center'>
            <img src={logoImg} alt='' />
            trackify
          </h1>
          <form className='d-flex' onSubmit={checkLoginDetails}>
            <div className='input_field'>
              <label htmlFor='email' className='custom_input'>
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  ref={email}
                />
                <p className='custom_label'>Email</p>
              </label>
            </div>
            <div className='input_field password_field'>
              <img
                className='show_password'
                src={showPasswordImg}
                alt=''
                onClick={() => setShowPassword(!showPassword)}
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
              <div className='login_other_btns d-flex'>
                <Link to='/verify-email/register'>Don't have an account?</Link>
                <Link to='/verify-email/change-password'>Forgot Password</Link>
              </div>
            </div>

            <input type='submit' value='Login' />
          </form>
        </div>
      </div>
    </>
  );
}
