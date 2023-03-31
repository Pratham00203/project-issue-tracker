import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function AddRole({
  selectedUser,
  setShowAddRoleModal,
  projectid,
  companyPeople,
  setProject,
}) {
  const [projectRole, setProjectRole] = useState("");

  useEffect(() => {
    setProjectRole(selectedUser.projectRole);
    window.addEventListener("click", handleModalClick);

    function handleModalClick(e) {
      if (e.target === document.querySelector(".bg-dark")) {
        setShowAddRoleModal(false);
      }
    }
    return () => {
      window.removeEventListener("click", handleModalClick);
    };
    //eslint-disable-next-line
  }, []);

  const verify = () => {
    if (projectRole.trim() === "") {
      toast.error("Field cannot be empty");
    } else {
      addProjectRole();
    }
  };

  const addProjectRole = async () => {
    try {
      const res = await axios({
        method: "put",
        url: `https://trackify-backend.onrender.com/api/project/add/role/${projectid}/${selectedUser.email}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
        data: {
          projectRole: projectRole,
        },
      });

      toast.success(res.data.msg);
      let updatedCompanyPeople = [];

      companyPeople.forEach((cp) => {
        if (cp.email === selectedUser.email) {
          cp.projectRole = projectRole;
          updatedCompanyPeople.push(cp);
        } else {
          updatedCompanyPeople.push(cp);
        }
      });

      setProject((prev) => {
        return {
          ...prev,
          companyPeople: updatedCompanyPeople,
        };
      });
      setShowAddRoleModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='bg-dark'></div>
      <div className='d-flex justify-center'>
        <div className='add-role-modal'>
          <h1>{selectedUser.name}</h1>
          <label htmlFor='projectRole'>Project Role</label>
          <input
            type='text'
            name='projectRole'
            value={projectRole}
            onChange={(e) => {
              setProjectRole(e.target.value);
            }}
          />
          <p>Describe what this user's role is in the project.</p>
          <button onClick={verify}>Assign</button>
        </div>
      </div>
    </>
  );
}
