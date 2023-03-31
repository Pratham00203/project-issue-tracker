import { Link, useParams } from "react-router-dom";
import Navbar from "./subcomponents/Navbar";
import searchImg from "../assets/images/search.png";
import { useEffect, useState } from "react";
import axios from "axios";
import exportFromJSON from "export-from-json";

export default function ProjectDashboard() {
  const { projectid } = useParams();
  const [status, setStatus] = useState("Backlog");
  const [isDownloading, setIsDownloading] = useState(false);
  const [project, setProject] = useState(null);
  const [projectIssues, setProjectIssues] = useState([]);
  const [downloadedIssues, setDownloadedIssues] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadProject();
    loadIssues();
    //eslint-disable-next-line
  }, []);

  const loadProject = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `https://trackify-backend.onrender.com/api/project/get/${projectid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setProject(res.data.project);
    } catch (error) {
      console.log(error);
    }
  };

  const loadIssues = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `https://trackify-backend.onrender.com/api/issue/${projectid}/issues/all`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setProjectIssues(res.data.issues);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadIssues = async () => {
    try {
      setIsDownloading(true);
      const res = await axios({
        method: "get",
        url: `https://trackify-backend.onrender.com/api/issue/${projectid}/download/issues/all`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      exportFromJSON({
        data: res.data.issues,
        fileName: "issues",
        exportType: "xls",
      });

      setIsDownloading(false);
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
                <Link to={`/project/${projectid}/create/issue/new`}>
                  + Create Issue
                </Link>
                <Link to={`/project/${project._id}/details`}>View Details</Link>
              </div>
            </div>
          </header>
          <main className='issue-dashboard'>
            <div className='search-bar d-flex align-center'>
              <img src={searchImg} alt='' />
              <input
                type='search'
                name=''
                placeholder='Search Issues'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
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
                  {projectIssues
                    .filter((i) => {
                      return query.toLocaleLowerCase().trim() === ""
                        ? i
                        : i.shortSummary.toLowerCase().includes(query) ||
                            i.description.toLowerCase().includes(query);
                    })
                    .map((i) => {
                      return (
                        i.status === "Backlog" && (
                          <Link to={`/project/${projectid}/issue/${i._id}`}>
                            <div className='issue' key={i._id}>
                              <p>
                                <b>Short Summary : </b>
                                {i.shortSummary}
                              </p>
                              <p>
                                <b>Priority : </b>{" "}
                                <span className={`${i.priority.toLowerCase()}`}>
                                  {i.priority}
                                </span>
                              </p>
                            </div>
                          </Link>
                        )
                      );
                    })}
                </div>
              )}
              {status === "In Progress" && (
                <div className='in-progress-issues'>
                  {projectIssues
                    .filter((i) => {
                      return query.toLocaleLowerCase().trim() === ""
                        ? i
                        : i.shortSummary.toLowerCase().includes(query) ||
                            i.description.toLowerCase().includes(query);
                    })
                    .map((i) => {
                      return (
                        i.status === "In Progress" && (
                          <Link to={`/project/${projectid}/issue/${i._id}`}>
                            <div className='issue' key={i._id}>
                              <p>
                                <b>Short Summary : </b>
                                {i.shortSummary}
                              </p>
                              <p>
                                <b>Priority : </b>{" "}
                                <span className={`${i.priority.toLowerCase()}`}>
                                  {i.priority}
                                </span>
                              </p>
                            </div>
                          </Link>
                        )
                      );
                    })}
                </div>
              )}
              {status === "Done" && (
                <div className='done-issues'>
                  {projectIssues
                    .filter((i) => {
                      return query.toLocaleLowerCase().trim() === ""
                        ? i
                        : i.shortSummary.toLowerCase().includes(query) ||
                            i.description.toLowerCase().includes(query);
                    })
                    .map((i) => {
                      return (
                        i.status === "Done" && (
                          <Link to={`/project/${projectid}/issue/${i._id}`}>
                            <div className='issue' key={i._id}>
                              <p>
                                <b>Short Summary : </b>
                                {i.shortSummary}
                              </p>
                              <p>
                                <b>Priority : </b>{" "}
                                <span className={`${i.priority.toLowerCase()}`}>
                                  {i.priority}
                                </span>
                              </p>
                            </div>
                          </Link>
                        )
                      );
                    })}
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
                {isDownloading ? "Exporting" : "Export as an excel file"}
              </span>
            </button>
          </main>
        </div>
      )}
    </>
  );
}
