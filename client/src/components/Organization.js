import { useContext, useEffect, useState } from "react";
import Navbar from "./subcomponents/Navbar";
import boxImg from "../assets/images/box.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import UserContext from "../context/UserContext";
import moment from "moment";
import Spinner from "./subcomponents/Spinner";

export default function Organization() {
  useEffect(() => {
    getOrganization();
  }, []);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [organization, setOrganization] = useState(null);
  const { user } = useContext(UserContext);

  const getOrganization = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "http://localhost:5000/api/organization/my-organization",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setOrganization(res.data.organization[0]);
      setIsLoading(false);
    } catch (error) {
      // toast.error(error.response.data.error);
      console.log(error);
      setIsLoading(false);
    }
  };

  const removeMember = async (email, mode) => {
    try {
      let res;
      if (mode === "Head") {
        res = true;
      } else {
        res = window.confirm("Are you sure you want to remove this member?");
      }

      if (res) {
        res = await axios({
          method: "delete",
          url: `http://localhost:5000/api/organization/remove/user/${organization._id}/${email}`,
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        });

        let updatedMembers = organization.members.filter(
          (m) => m.email !== email
        );

        setOrganization((prev) => {
          return {
            ...prev,
            members: updatedMembers,
          };
        });

        toast.success(res.data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const makeOrganizationHead = async (email) => {
    try {
      let res = window.confirm(
        "Are you sure you want to make selected member this organization's head?"
      );

      if (res) {
        res = await axios({
          method: "put",
          url: `http://localhost:5000/api/organization/change-head/${organization._id}`,
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
          data: {
            email: email,
          },
        });

        setOrganization((prev) => {
          return {
            ...prev,
            organizationHead: res.data.newHead.id,
            organizationHeadName: res.data.newHead.name,
          };
        });

        toast.success(res.data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exitOrganization = async () => {
    try {
      let res = window.confirm(
        "Are you sure you want to exit this organization?"
      );
      if (res) {
        if (organization.organizationHead === user.id) {
          alert(
            "You are currently the head of the organization. Please change the organization head first to exit from the organization."
          );
        } else {
          removeMember(user.email, "Head");
          navigate("/projects/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrganization = async () => {
    try {
      let res = window.confirm(
        "Are you sure you want to delete this organization?"
      );
      if (res) {
        res = await axios({
          method: "delete",
          url: `http://localhost:5000/api/organization/delete/${organization._id}`,
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        });

        toast.success(res.data.msg);
        navigate("/projects/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      {!isLoading ? (
        organization ? (
          <div className='my-organization'>
            <header>
              <h1>My Organization</h1>
              {organization && (
                <div
                  className='organization-details d-flex flex-col'
                  style={{ gap: "8px" }}>
                  <h2>Name : {organization.name}</h2>
                  <p>
                    <b>Description : </b>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: organization.description,
                      }}></span>
                  </p>
                  <p>
                    <b>Organization Head : </b>
                    {organization.organizationHeadName}
                  </p>
                  <p className='join-org-link'>
                    <b>Join Link : </b>
                    <span>{`http://localhost:3000/organization/join/${organization._id}`}</span>
                  </p>
                </div>
              )}
              {organization && (
                <>
                  <Link
                    className='update-org-btn'
                    to={`/organization/${organization._id}/update`}>
                    Update details
                  </Link>
                  <button className='red-btn' onClick={exitOrganization}>
                    Exit organization
                  </button>
                  {user.id === organization.organizationHead && (
                    <button className='red-btn' onClick={deleteOrganization}>
                      Delete organization
                    </button>
                  )}
                </>
              )}
            </header>
            <main>
              <h3>Members</h3>
              <table className='my-table'>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Joined On</td>
                    {organization.organizationHead === user.id && (
                      <td>Action</td>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {organization.members.map((m) => {
                    return (
                      <tr key={m._id}>
                        <td>{m.name}</td>
                        <td>{moment(m.joinedOn).format("LL")}</td>
                        {organization.organizationHead === user.id &&
                          organization.organizationHead !== m.id && (
                            <td>
                              <button
                                onClick={() => makeOrganizationHead(m.email)}>
                                Make organization head
                              </button>
                              <button
                                className='red-btn'
                                onClick={() => removeMember(m.email)}>
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
        ) : (
          <div
            className='no-projects d-flex align-center justify-center'
            style={{ flexDirection: "column" }}>
            <p>You aren't involved in any of the organization right now.</p>
            <img src={boxImg} alt='' />
          </div>
        )
      ) : (
        <Spinner />
      )}
    </>
  );
}
