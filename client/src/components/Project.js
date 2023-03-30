import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import Navbar from "./subcomponents/Navbar";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AddProjectMember from "./subcomponents/AddProjectMember";
import AddRole from "./subcomponents/AddRole";
import { toast } from "react-hot-toast";

export default function Project() {
  const { projectid } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [project, setProject] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadProject();
    //eslint-disable-next-line
  }, []);

  const loadProject = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:5000/api/project/get/${projectid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setProject(res.data.project);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMemberModalClick = async () => {
    const res = await checkOrganization();
    if (res) {
      setShowMemberModal(true);
    } else {
      toast.error("Not in any organization");
    }
  };

  const checkOrganization = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "http://localhost:5000/api/organization/check-existence",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      if (res.data.msg === "Not in any organization") {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return true;
    }
  };

  const deleteMemberConfirm = (email) => {
    const res = window.confirm(
      "Are you sure you want to remove this user from the project?"
    );
    if (res) {
      removeMember(email);
    }
  };

  const removeMember = async (email) => {
    try {
      const res = await axios({
        method: "delete",
        url: `http://localhost:5000/api/project/${projectid}/remove/member/${email}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setProject((prev) => {
        return {
          ...prev,
          clients: prev.clients.filter((c) => c.email !== email),
          companyPeople: prev.companyPeople.filter((cp) => cp.email !== email),
        };
      });
      toast.success(res.data.msg);
    } catch (error) {
      console.log(error);
    }
  };

  const makeProjectHeadConfirm = (email) => {
    const res = window.confirm(
      "Are you sure you want to make this user project head?"
    );
    if (res) {
      makeProjectHead(email);
    }
  };

  const makeProjectHead = async (email) => {
    try {
      const res = await axios({
        method: "put",
        url: `http://localhost:5000/api/project/update/${projectid}/change-project-head/${email}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setProject((prev) => {
        return {
          ...prev,
          projectHead: res.data.newHead.id,
          projectHeadName: res.data.newHead.name,
        };
      });

      toast.success(res.data.msg);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProjectConfirm = () => {
    const res = window.confirm(
      "Are you sure you want to delete this project? Changes will be irreversible!"
    );
    res && deleteProject();
  };

  const deleteProject = async () => {
    try {
      const res = await axios({
        method: "delete",
        url: `http://localhost:5000/api/project/delete/${projectid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      toast.success(res.data.msg);
      navigate("/projects/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const exitProjectConfirm = () => {
    if (project.projectHead === user.id) {
      window.alert(
        "You are currently the Project Head for this project. Please change the project head to some other member to leave this project."
      );
    } else {
      const res = window.confirm(
        "Are you sure you want to exit from this project?"
      );

      if (res) {
        removeMember(user.email);
        setTimeout(() => {
          navigate("/projects/dashboard");
        }, 500);
      }
    }
  };

  return (
    <>
      <Navbar />
      {showAddRoleModal && (
        <AddRole
          selectedUser={selectedUser}
          setShowAddRoleModal={setShowAddRoleModal}
          projectid={projectid}
          companyPeople={project.companyPeople}
          setProject={setProject}
        />
      )}
      {showMemberModal && (
        <AddProjectMember
          showMemberModal={showMemberModal}
          setShowMemberModal={setShowMemberModal}
          projectid={projectid}
          companyPeople={project.companyPeople}
        />
      )}
      {!isLoading ? (
        project && (
          <div className='my-organization'>
            <header>
              {project && (
                <div
                  className='organization-details d-flex flex-col'
                  style={{ gap: "8px" }}>
                  <h1 style={{ margin: "0" }}>{project.name}</h1>
                  <p>
                    <b>Description : </b>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: project.description,
                      }}></span>
                  </p>
                  <p>
                    <b>Project URL : </b>
                    {project.url}
                  </p>
                  <p>
                    <b>Project Head : </b>
                    {project.projectHeadName}
                  </p>
                  <p className='join-org-link'>
                    <b>Join Link : </b>
                    <span>{`http://localhost:3000/project/join/${project._id}`}</span>
                  </p>
                </div>
              )}
              {project && (
                <>
                  {user.role === "Company" && (
                    <>
                      <button
                        style={{ marginRight: "20px" }}
                        onClick={handleMemberModalClick}>
                        Add members from organization
                      </button>
                      <Link
                        to={`/project/${project._id}/update`}
                        className='update-org-btn'>
                        Update Project Details
                      </Link>
                    </>
                  )}

                  {project.projectHead === user.id && (
                    <button
                      style={{
                        backgroundColor: "rgb(241, 37, 37)",
                        marginRight: "20px",
                      }}
                      onClick={deleteProjectConfirm}>
                      Delete Project
                    </button>
                  )}
                  <button
                    style={{ backgroundColor: "rgb(241, 37, 37)" }}
                    onClick={exitProjectConfirm}>
                    Exit from project
                  </button>
                </>
              )}
            </header>
            <main>
              <h3>Clients</h3>
              <table className='my-table'>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Project Role</td>
                    <td>Joined On</td>
                    {project.projectHead === user.id && <td>Action</td>}
                  </tr>
                </thead>
                <tbody>
                  {project.clients.map((c) => {
                    return (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>{c.projectRole ? c.projectRole : c.role}</td>
                        <td>{moment(c.joinedOn).format("LL")}</td>
                        {project.projectHead === user.id && (
                          <td>
                            <button
                              className='red-btn'
                              style={{ margin: "0" }}
                              onClick={() => deleteMemberConfirm(c.email)}>
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <h3 style={{ marginTop: "40px" }}>Company People</h3>
              <table className='my-table'>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Project Role</td>
                    <td>Joined On</td>
                    {project.projectHead === user.id && <td>Action</td>}
                  </tr>
                </thead>
                <tbody>
                  {project.companyPeople.map((cp) => {
                    return (
                      <tr key={cp._id}>
                        <td>{cp.name}</td>
                        <td>{cp.projectRole ? cp.projectRole : cp.role}</td>
                        <td>{moment(cp.joinedOn).format("LL")}</td>
                        {project.projectHead === user.id &&
                          project.projectHead !== cp.id && (
                            <td className='d-flex' style={{ gap: "20px" }}>
                              <button
                                onClick={() =>
                                  makeProjectHeadConfirm(cp.email)
                                }>
                                Make Project head
                              </button>
                              <button
                                onClick={() => {
                                  setShowAddRoleModal(true);
                                  setSelectedUser({
                                    name: cp.name,
                                    projectRole: cp.projectRole,
                                    email: cp.email,
                                  });
                                }}>
                                {cp.projectRole ? "Edit Role" : "Add Role"}
                              </button>
                              <button
                                className='red-btn'
                                style={{ margin: "0" }}
                                onClick={() => deleteMemberConfirm(cp.email)}>
                                Remove
                              </button>
                            </td>
                          )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </main>
          </div>
        )
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}
