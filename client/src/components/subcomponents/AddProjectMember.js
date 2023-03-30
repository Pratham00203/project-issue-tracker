import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import profileImg from "../../assets/images/profile-pic.jpg";
import UserContext from "../../context/UserContext";

export default function AddProjectMember({
  showMemberModal,
  setShowMemberModal,
  projectid,
  companyPeople,
}) {
  const [members, setMembers] = useState([]);
  const { user } = useContext(UserContext);
  useEffect(() => {
    loadMembers();
    window.addEventListener("click", handleModalClick);

    function handleModalClick(e) {
      if (e.target === document.querySelector(".bg-dark")) {
        setShowMemberModal(false);
      }
    }
    return () => {
      window.removeEventListener("click", handleModalClick);
    };
    //eslint-disable-next-line
  }, []);

  const loadMembers = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "http://localhost:5000/api/organization/get/members",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setMembers(res.data.organizationMembers.members);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyProjectUser = async (email) => {
    try {
      let res = await axios({
        method: "get",
        url: `http://localhost:5000/api/project/check-user/${email}/${projectid}`,
      });

      if (res.status === 200) {
        joinProject(email);
      }
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  const joinProject = async (email) => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:5000/api/project/${projectid}/add/member/${email}`,
      });
      toast.success(res.data.msg);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfAlreadyInProject = (email) => {
    return JSON.stringify(companyPeople).includes(email) ? false : true;
  };

  return (
    <>
      <div className='bg-dark'></div>
      <div className='d-flex align-center justify-center'>
        <div className='add-project-members-modal'>
          <h1>Your Organization</h1>
          <div className='members'>
            {members.map((m) => {
              return (
                <div key={m.id} className='member d-flex align-center'>
                  <img src={profileImg} alt='' />
                  <p>{m.name}</p>
                  {user.id !== m.id && checkIfAlreadyInProject(m.email) && (
                    <button
                      style={{ marginLeft: "auto" }}
                      onClick={() => verifyProjectUser(m.email)}>
                      + Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
