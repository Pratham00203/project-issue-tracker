import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./subcomponents/Navbar";
import TextEditor from "./subcomponents/TextEditor";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function OrganizationForm({ option }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (option === "Update") {
      getOrganization();
    }
    //eslint-disable-next-line
  }, []);

  const getOrganization = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "https://trackify-backend.onrender.com/api/organization/my-organization",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setName(res.data.organization[0].name);
      setDescription(res.data.organization[0].description);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    option === "Create" ? createOrganization() : updateOrganization();
  };

  const createOrganization = async () => {
    try {
      const res = await axios({
        method: "post",
        url: "https://trackify-backend.onrender.com/api/organization/create",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
        data: {
          name: name,
          description: description,
        },
      });

      toast.success(res.data.msg);
      navigate("/my-organization");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };
  const updateOrganization = async () => {
    try {
      const res = await axios({
        method: "put",
        url: "https://trackify-backend.onrender.com/api/organization/update/details",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
        data: {
          name: name,
          description: description,
        },
      });

      toast.success(res.data.msg);
      navigate("/my-organization");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='organization-form my-form'>
        <h1>
          {option === "Create"
            ? "Create organization"
            : "Update organization details"}
        </h1>
        <form className='d-flex flex-col' onSubmit={handleSubmit}>
          <label htmlFor='name'>
            <p>Name</p>
            <input
              type='text'
              name='name'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label htmlFor='description'>
            <p>Description</p>
            <TextEditor
              description={description}
              setDescription={setDescription}
            />
            <p>Describe the organization in as much detail as you'd like.</p>
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
