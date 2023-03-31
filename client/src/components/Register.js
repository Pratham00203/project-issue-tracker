import showPasswordImg from "../assets/images/password.png";
import logoImg from "../assets/images/logo.png";
import { useNavigate, useParams } from "react-router-dom";
import { isExpired } from "react-jwt";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import checkAuth from "../helpers/auth";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const name = useRef();
  const role = useRef();
  const email = useRef();
  const password = useRef();

  useEffect(() => {
    if (token) {
      if (isExpired(token)) {
        navigate("/verify-email/register");
      }
    } else {
      navigate("/verify-email/register");
    }

    //eslint-disable-next-line
  }, []);

  const checkRegisterDetails = (e) => {
    e.preventDefault();
    if (
      name.current.value.trim() === "" ||
      role.current.value.trim() === "" ||
      email.current.value.trim() === "" ||
      password.current.value.trim() === ""
    ) {
      toast.error("All fields are required");
    } else {
      register();
    }
  };

  const register = async () => {
    try {
      let res = await axios({
        method: "post",
        url: "https://trackify-backend.onrender.com/api/auth/register",
        data: {
          email: email.current.value,
          password: password.current.value,
          name: name.current.value,
          role: role.current.value,
        },
        headers: {
          "x-auth-token": token,
        },
      });

      localStorage.setItem("token", res.data.token);
      if (checkAuth()) {
        toast.success("Account Created");
        navigate("/projects/dashboard");
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <div className='register-container d-flex justify-center align-center'>
        <div className='register-form'>
          <h1 className='logo d-flex align-center justify-center'>
            <img src={logoImg} alt='' />
            trackify
          </h1>
          <p>Keep track of every issue, every step of the way.</p>
          <form
            className='d-flex'
            style={{ flexDirection: "column" }}
            onSubmit={checkRegisterDetails}>
            <div className='input_field'>
              <label htmlFor='name' className='custom_input'>
                <input type='text' name='name' placeholder='Name' ref={name} />
                <p className='custom_label'>Name</p>
              </label>
            </div>
            <div className='input_field'>
              <p className='select_label'>Select Role</p>
              <label htmlFor='role' className='custom_input'>
                <select name='role' ref={role}>
                  <option value='Client'>Client</option>
                  <option value='Company'>Company</option>
                </select>
              </label>
            </div>
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
            </div>

            <input type='submit' value='Register' />
          </form>
        </div>
      </div>
    </>
  );
}
