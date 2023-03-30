import { useState, useEffect } from "react";
import Navbar from "./subcomponents/Navbar";
import TextEditor from "./subcomponents/TextEditor";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export default function ProjectForm({ option }) {
  const navigate = useNavigate();
  const { projectid } = useParams();
  const [description, setDescription] = useState("");
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    url: "",
    deadline: "",
  });

  useEffect(() => {
    if (option === "Update") {
      loadProject();
    }
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

      setProjectDetails({
        name: res.data.project.name,
        url: res.data.project.url,
        deadline: res.data.project.deadline,
      });
      setDescription(res.data.project.description);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectDetails.name.trim() === "") {
      toast.error("Name is required");
    } else {
      option === "Create" ? checkProject() : updateProject();
    }
  };

  const checkProject = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:5000/api/project/check/project/${projectDetails.name}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      if (res.status === 200) {
        createProject();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createProject = async () => {
    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:5000/api/project/create/new",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
        data: {
          name: projectDetails.name,
          url: projectDetails.url,
          deadline: projectDetails.deadline,
          description: description,
        },
      });

      toast.success(res.data.msg);
      navigate("/projects/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const updateProject = async () => {
    try {
      const res = await axios({
        method: "put",
        url: `http://localhost:5000/api/project/update/${projectid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
        data: {
          name: projectDetails.name,
          url: projectDetails.url,
          deadline: projectDetails.deadline,
          description: description,
        },
      });

      toast.success(res.data.msg);
      navigate(`/project/${projectid}/details`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='project-form my-form'>
        {option === "Update" && (
          <p className='breadcrumb'>
            Projects / {projectDetails.name} / Project Details
          </p>
        )}
        <h1>{option === "Create" ? "Create Project" : "Update Project"}</h1>
        <form className='d-flex flex-col' onSubmit={handleSubmit}>
          <label htmlFor='name'>
            <p>Name</p>
            <input
              type='text'
              name='name'
              value={projectDetails.name}
              onChange={handleChange}
            />
          </label>
          <label htmlFor='url'>
            <p>URL</p>
            <input
              type='text'
              name='url'
              value={projectDetails.url}
              onChange={handleChange}
            />
          </label>
          <label htmlFor='description'>
            <p>Description</p>
            <TextEditor
              description={description}
              setDescription={setDescription}
            />
            <p>Describe the project in as much detail as you'd like.</p>
          </label>
          <label htmlFor='deadline'>
            <p>Completion Date</p>
            <input
              type='text'
              name='deadline'
              placeholder='MM/DD/YYYY'
              value={projectDetails.deadline}
              onChange={handleChange}
            />
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
