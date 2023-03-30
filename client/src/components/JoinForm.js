import checkAnimation from "../assets/images/checked-animation.gif";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function JoinForm({ option }) {
  const { organizationid } = useParams();
  const { projectid } = useParams();
  const [isVerfied, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const email = useRef();

  const verify = () => {
    if (email.current.value.trim() === "") {
      toast.error("Email is required");
    } else {
      option === "Organization"
        ? verifyOrganizationUser()
        : verifyProjectUser();
    }
  };

  const verifyOrganizationUser = async () => {
    try {
      setIsLoading(true);
      let res = await axios({
        method: "get",
        url: `http://localhost:5000/api/organization/check-user/${organizationid}/${email.current.value}`,
      });

      if (res.status === 200) {
        setIsLoading(false);
        joinOrganization();
      }
    } catch (error) {
      setTimeout(() => {
        toast.error(error.response.data.error);
        setIsVerified(false);
        setIsLoading(false);
      }, 1500);
    }
  };

  const verifyProjectUser = async () => {
    try {
      setIsLoading(true);
      let res = await axios({
        method: "get",
        url: `http://localhost:5000/api/project/check-user/${email.current.value}/${projectid}`,
        data: {
          email: email.current.value,
        },
      });

      if (res.status === 200) {
        setIsLoading(false);
        joinProject();
      }
    } catch (error) {
      setTimeout(() => {
        toast.error(error.response.data.error);
        setIsVerified(false);
        setIsLoading(false);
      }, 1500);
    }
  };

  const joinOrganization = async () => {
    try {
      const res = await axios({
        method: "put",
        url: `http://localhost:5000/api/organization/add/user/${organizationid}`,
        data: {
          email: email.current.value,
        },
      });

      if (res.data.msg === "Member Added") {
        setIsVerified(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const joinProject = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:5000/api/project/${projectid}/add/member/${email.current.value}`,
      });
      if (res.data.msg === "Member Added to the project") {
        setIsVerified(true);
      }
    } catch (error) {
      console.log(error);
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
            Please enter your email Id used to login into the application to
            join this
            {option === "Organization" ? " organization." : " project."}
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
          <h3>
            You have joined this
            {option === "Organization" ? " organization " : " project "}
            successfully!
          </h3>
          <img src={checkAnimation} alt='' />
        </div>
      </div>
    </>
  );
}
