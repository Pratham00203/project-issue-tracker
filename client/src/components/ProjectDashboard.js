import { Link, useParams } from "react-router-dom";
import Navbar from "./subcomponents/Navbar";
import searchImg from "../assets/images/search.png";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectDashboard() {
  const { projectid } = useParams();
  const [status, setStatus] = useState("Backlog");
  const [isDownloading, setIsDownloading] = useState(false);
  const [project, setProject] = useState(null);

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

  const downloadIssues = async () => {
    try {
      setIsDownloading(true);
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      {project && (
        <div className='project-dashboard'>
          <header>
            <div
              className='d-flex align-center'
              style={{ justifyContent: "space-between" }}>
              <div>
                <p className='breadcrumb'>
                  Projects / {project.name} / Dashboard
                </p>
                <h1>Issues</h1>
              </div>
              <div
                className='dashboard-btns d-flex'
                style={{ gap: "20px", margin: "30px 0" }}>
                <button>+ Create Issue</button>
                <Link to={`/project/${project._id}/details`}>View Details</Link>
              </div>
            </div>
          </header>
          <main className='issue-dashboard'>
            <div className='search-bar d-flex align-center'>
              <img src={searchImg} alt='' />
              <input type='search' name='' placeholder='Search Issues' />
            </div>
            <div className='status-select d-flex'>
              <p
                onClick={() => setStatus("Backlog")}
                className={`backlog ${status === "Backlog" ? "active" : ""}`}>
                Backlog
              </p>
              <p
                onClick={() => setStatus("In Progress")}
                className={`progress ${
                  status === "In Progress" ? "active" : ""
                }`}>
                In Progress
              </p>
              <p
                onClick={() => setStatus("Done")}
                className={`done ${status === "Done" ? "active" : ""}`}>
                Done
              </p>
            </div>
            <div className='issues'>
              {status === "Backlog" && (
                <div className='backlog-issues'>
                  <div className='issue'>
                    <p>
                      <b>Short Summary : </b>Lorem ipsum dolor sit amet
                      consectetur
                    </p>
                    <p>
                      <b>Priority : </b> <span className='high'>High</span>
                    </p>
                  </div>
                </div>
              )}
              {status === "In Progress" && (
                <div className='in-progress-issues'>
                  <div className='no-issues d-flex'>
                    Nothing to show here : (
                  </div>
                </div>
              )}
              {status === "Done" && (
                <div className='done-issues'>
                  <div className='no-issues d-flex'>
                    Nothing to show here : (
                  </div>
                </div>
              )}
            </div>
            <button
              className='issue-download-btn'
              onClick={downloadIssues}
              disabled={isDownloading}>
              {isDownloading && (
                <i
                  className='fa fa-spinner fa-spin'
                  style={{ marginRight: "7px" }}></i>
              )}
              <span>
                {isDownloading ? "Downloading" : "Download as an excel file"}
              </span>
            </button>
          </main>
        </div>
      )}
    </>
  );
}
