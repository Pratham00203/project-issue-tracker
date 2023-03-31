import Navbar from "./subcomponents/Navbar";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import boxImg from "../assets/images/box.png";
import UserContext from "../context/UserContext";
import axios from "axios";
import moment from "moment";
import Spinner from "./subcomponents/Spinner";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, changeUserSettings } = useContext(UserContext);

  useEffect(() => {
    getUser();
    getProjects();
    //eslint-disable-next-line
  }, []);

  const getUser = async () => {
    try {
      let res = await axios({
        method: "get",
        url: "http://localhost:5000/api/auth/",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      changeUserSettings({
        name: res.data.user.name,
        id: res.data.user._id,
        email: res.data.user.email,
        role: res.data.user.role,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getProjects = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "http://localhost:5000/api/project/get/projects/all",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setProjects(res.data.projects);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='dashboard'>
        <header>
          <h1>My Projects</h1>
          {user.role === "Company" && (
            <Link to='/project/create' className='create-project-btn'>
              Create a Project
            </Link>
          )}
        </header>
        <main>
          {!isLoading ? (
            projects.length === 0 ? (
              <div
                className='no-projects d-flex align-center justify-center'
                style={{ flexDirection: "column" }}>
                <p>You aren't involved in any of the projects right now.</p>
                <img src={boxImg} alt='' />
              </div>
            ) : (
              <table className='my-table project-table'>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Description</td>
                    <td>Project Head</td>
                    <td>Created On</td>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => {
                    return (
                      <tr key={p._id}>
                        <td>
                          <Link to={`/project/${p._id}/dashboard`}>
                            {p.name}
                          </Link>
                        </td>
                        <td
                          dangerouslySetInnerHTML={{
                            __html: p.description,
                          }}></td>
                        <td>{p.projectHeadName}</td>
                        <td>{moment(p.createdOn).format("LL")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          ) : (
            <Spinner />
          )}
        </main>
      </div>
    </>
  );
}
