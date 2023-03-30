import checkAnimation from "../assets/images/checked-animation.gif";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function EmailForm({ option }) {
  const [isVerfied, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const email = useRef();

  const verify = () => {
    if (email.current.value.trim() === "") {
      toast.error("Email is required");
    } else {
      option === "Register" ? registerEmail() : changePasswordEmail();
    }
  };

  const registerEmail = async () => {
    try {
      setIsLoading(true);
      let res = await axios({
        method: "post",
        url: "http://localhost:5000/api/auth/check-email/registration",
        data: {
          email: email.current.value,
        },
      });

      if (res.status === 200) {
        setIsVerified(true);
        setIsLoading(false);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error(error.response.data.error);
        setIsVerified(false);
        setIsLoading(false);
      }, 1500);
    }
  };
  const changePasswordEmail = async () => {
    try {
      setIsLoading(true);
      let res = await axios({
        method: "post",
        url: "http://localhost:5000/api/auth/check-email/forgot-password",
        data: {
          email: email.current.value,
        },
      });

      if (res.status === 200) {
        setIsVerified(true);
        setIsLoading(false);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error(error.response.data.error);
        setIsVerified(false);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <>
      <div className='wrapper-container d-flex align-center'>
        <div
          className='email-form verification-modal d-flex justify-center align-center'
          style={
            isVerfied ? { display: "none" } : { display: "flex !important" }
          }>
          <h3>Enter your email ID</h3>
          <p>
            We'll send you a link via your email to{" "}
            {option === "Register"
              ? "register yourself."
              : "change your account password."}
          </p>
          <div className='form'>
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
            <button type='button' onClick={verify} disabled={isLoading}>
              {isLoading && (
                <i
                  className='fa fa-spinner fa-spin'
                  style={{ marginRight: "7px" }}></i>
              )}
              <span>{isLoading ? "Verifying" : "Verify"}</span>
            </button>
          </div>
        </div>
        <div
          className='mail-sent-modal verification-modal d-flex align-center'
          style={!isVerfied ? { display: "none" } : {}}>
          <h3>We have sent you a mail!</h3>
          <img src={checkAnimation} alt='' />
          <p>
            Please click on the link received via email to{" "}
            {option === "Register"
              ? "register yourself."
              : "change your account password."}
          </p>
        </div>
      </div>
    </>
  );
}
