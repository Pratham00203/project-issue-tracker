import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./subcomponents/Navbar";
import TextEditor from "./subcomponents/TextEditor";
import UserContext from "../context/UserContext";

export default function IssueForm({ option }) {
  const { projectid, issueid } = useParams();
  const navigate = useNavigate();
  const [showAssigneesOption, setShowAssigneesOption] = useState(false);
  const [project, setProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [issueDetails, setIssueDetails] = useState({
    shortSummary: "",
    estimateInHours: 0,
    priority: "High",
    status: "Backlog",
    assignees: [],
  });
  const [description, setDescription] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    option === "Update" && loadIssueDetails();
    loadProjectMembers();
    loadProject();

    window.addEventListener("click", handleSelectClick);

    function handleSelectClick(e) {
      if (e.target !== document.querySelector(".assignees-field")) {
        setShowAssigneesOption(false);
      }
    }

    return () => {
      window.removeEventListener("click", handleSelectClick);
    };
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

  const loadIssueDetails = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `https://trackify-backend.onrender.com/api/issue/${projectid}/${issueid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      console.log(res.data.issue);
      setIssueDetails({
        shortSummary: res.data.issue.shortSummary,
        estimateInHours: res.data.issue.estimateInHours,
        priority: res.data.issue.priority,
        status: res.data.issue.status,
        assignees: res.data.issue.assignees,
      });
      setDescription(res.data.issue.description);
    } catch (error) {
      console.log(error);
    }
  };

  const loadProjectMembers = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `https://trackify-backend.onrender.com/api/project/get/company-people/${projectid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setProjectMembers(res.data.members);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (issueDetails.shortSummary.trim() === "" || description.trim() === "") {
      toast.error("All fields are required");
    } else {
      option === "Create" ? createIssue() : updateIssue();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssueDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const addAssignee = (member) => {
    const newMember = {
      name: member.name,
      id: member.id,
      projectRole: member.projectRole,
      email: member.email,
    };

    const alreadyExist = issueDetails.assignees.find(
      (a) => a.email === newMember.email
    );

    if (!alreadyExist) {
      setIssueDetails((prev) => {
        return {
          ...prev,
          assignees: [...prev.assignees, newMember],
        };
      });
    }
  };

  const removeAssignee = (member) => {
    const newAssignees = issueDetails.assignees.filter(
      (a) => a.email !== member.email
    );
    setIssueDetails((prev) => {
      return {
        ...prev,
        assignees: newAssignees,
      };
    });
  };

  const createIssue = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `https://trackify-backend.onrender.com/api/issue/${projectid}/create/new`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
        data: {
          shortSummary: issueDetails.shortSummary,
          priority: issueDetails.priority,
          status: issueDetails.status,
          estimateInHours: issueDetails.estimateInHours,
          assignees: issueDetails.assignees,
          description: description,
        },
      });

      toast.success(res.data.msg);
      navigate(`/project/${projectid}/dashboard`);
    } catch (error) {
      console.log(error);
    }
  };

  const updateIssue = async () => {
    try {
      const res = await axios({
        method: "put",
        url: `https://trackify-backend.onrender.com/api/issue/update/issue/${issueid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
        data: {
          shortSummary: issueDetails.shortSummary,
          priority: issueDetails.priority,
          status: issueDetails.status,
          estimateInHours: issueDetails.estimateInHours,
          assignees: issueDetails.assignees,
          description: description,
        },
      });

      toast.success(res.data.msg);
      navigate(`/project/${projectid}/dashboard`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='project-form my-form'>
        <h1>{option === "Create" ? "Create Issue" : "Update Issue"}</h1>
        <form className='d-flex flex-col' onSubmit={handleSubmit}>
          <label htmlFor='shortSummary'>
            <p>Short Summary</p>
            <input
              type='text'
              name='shortSummary'
              value={issueDetails.shortSummary}
              onChange={handleChange}
            />
            <p>Concisely summarize the issue in one or two sentences.</p>
          </label>
          <label htmlFor='description'>
            <p>Description</p>
            <TextEditor
              description={description}
              setDescription={setDescription}
            />
            <p>Describe the issue in as much detail as you'd like.</p>
          </label>
          <label htmlFor='estimateInHours'>
            <p>Estimate (Hours)</p>
            <input
              type='number'
              name='estimateInHours'
              value={issueDetails.estimateInHours}
              onChange={handleChange}
              min={1}
            />
          </label>
          <label htmlFor='priority'>
            <p>Priority</p>
            <select
              name='priority'
              value={issueDetails.priority}
              onChange={handleChange}>
              <option value='High' style={{ color: "rgb(241, 37, 37)" }}>
                High
              </option>
              <option value='Medium' style={{ color: "rgb(233, 127, 51)" }}>
                Medium
              </option>
              <option value='Low' style={{ color: "rgb(45, 135, 56)" }}>
                Low
              </option>
            </select>
          </label>
          <label htmlFor='status'>
            <p>Status</p>
            <select
              name='status'
              value={issueDetails.status}
              onChange={handleChange}>
              <option value='Backlog'>Backlog</option>
              <option value='In Progress'>In Progress</option>
              {option === "Update" ? (
                project &&
                project.projectHead === user.id && (
                  <option value='Done'>Done</option>
                )
              ) : (
                <option value='Done'>Done</option>
              )}
            </select>
          </label>
          <label htmlFor='assignees' style={{ position: "relative" }}>
            <p>Assignees</p>
            <div
              className='assignees-field d-flex'
              onClick={() => setShowAssigneesOption(true)}>
              {issueDetails.assignees.length === 0
                ? "Unassigned"
                : issueDetails.assignees.map((a) => {
                    return (
                      <div
                        className='assignee'
                        onClick={() => removeAssignee(a)}>
                        {a.name} <span> X</span>
                      </div>
                    );
                  })}
            </div>
            <div
              className='assignees-options flex-col'
              style={
                showAssigneesOption ? { display: "flex" } : { display: "none" }
              }>
              {projectMembers.length === 0
                ? "No project members"
                : projectMembers.map((m) => {
                    return (
                      <div
                        className='a-option'
                        key={m.id}
                        onClick={() => addAssignee(m)}>
                        {m.name}{" "}
                        {m.projectRole && <span>| {m.projectRole}</span>}
                      </div>
                    );
                  })}
            </div>
          </label>
          <input
            type='submit'
            value={option === "Create" ? "Create" : "Update"}
          />
        </form>
      </div>
    </>
  );
}
