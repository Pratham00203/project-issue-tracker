const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Project = require("../models/Project");
const Issue = require("../models/Issue");

// @route    POST api/project/create/new
// @desc     Create a New Project
// @access   Private
router.post("/create/new", auth, async (req, res) => {
  try {
    const { name, description, url } = req.body;

    if (req.user.role !== "Company") {
      return res.status(401).json({ error: "Not Authorized" });
    }

    const projectHead = req.user.id;
    const user = await User.findById(req.user.id, { name: 1 });
    const projectHeadName = user.name;

    const project = new Project({
      name,
      description,
      projectHead,
      projectHeadName,
      url,
    });

    await project.save();

    return res.status(200).json({ msg: "Project Created" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    GET api/project/check/project/:projectname
// @desc     Check if Project already exists
// @access   Public
router.get("/check/project/:projectname", async (req, res) => {
  try {
    const project = await Project.findOne({ name: req.params.projectname });

    if (project) {
      return res
        .status(400)
        .json({ error: "Project with this name already exists" });
    }

    return res.status(200).json({ msg: "Project Doesn't exists" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    POST api/project/:projectid/add/members
// @desc     Add members to the project
// @access   Private
router.post("/:projectid/add/members/", auth, async (req, res) => {
  try {
    const { members } = req.body;

    const clients = members.filter((c) => c.role === "Client");

    const companyPeople = members.filter((cp) => cp.role === "Company");

    let project = await Project.findById(req.params.projectid);

    project.clients = clients;
    project.companyPeople = companyPeople;

    await project.save();

    return res.status(200).json({ msg: "Members added" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    DELETE api/project/:projectid/remove/member/:userid
// @desc     Remove a member from project
// @access   Private
router.delete("/:projectid/remove/member/:userid", auth, async (req, res) => {
  try {
    let project = await Project.findById(req.params.projectid);

    project.clients = project.clients.filter(
      (c) => c.id.toString() !== req.params.userid
    );

    project.companyPeople = project.companyPeople.filter(
      (cp) => cp.id.toString() !== req.params.userid
    );

    await project.save();

    return res.status(200).json({ msg: "Member Removed" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    GET api/project/client/projects/all
// @desc     Get all the projects in which the client is involved
// @access   Private
router.get("/client/projects/all", auth, async (req, res) => {
  try {
    const projects = await Project.find({ "clients.id": req.user.id });

    return res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    GET api/project/company/projects/all
// @desc     Get all the projects in which the company user is involved
// @access   Private
router.get("/company/projects/all", auth, async (req, res) => {
  try {
    const projects = await Project.find({ "companyPeople.id": req.user.id });

    return res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    PUT api/project/update/:projectid
// @desc     Update project details
// @access   Private
router.put("/update/:projectid", auth, async (req, res) => {
  try {
    const { name, description, url } = req.body;

    if (req.user.role !== "Company") {
      return res.status(401).json({ error: "Not Authorized" });
    }

    await Project.findByIdAndUpdate(req.params.projectid, {
      name: name,
      description: description,
      url: url,
    });

    return res.status(200).json({ msg: "Project Updated" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    DELETE api/project/delete/:projectid
// @desc     Delete Project
// @access   Private
router.delete("/delete/:projectid", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectid);

    if (project.projectHead.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    await Issue.deleteMany({ projectId: req.params.projectid });
    await Project.findByIdAndDelete(req.params.projectid);

    return res.status(200).json({ msg: "Project Deleted" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    PUT api/project/update/:projectid/change-project-head/:userid
// @desc     Change project head of the project to some other user
// @access   Private
router.put(
  "/update/:projectid/change-project-head/:userid",
  auth,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectid);

      if (project.projectHead.toString() !== req.user.id) {
        return res.status(401).json({ error: "Not authorized" });
      }

      const user = await User.findById(req.params.userid, { name: 1 });

      await Project.findByIdAndUpdate(req.params.projectid, {
        projectHead: req.params.userid,
        projectHeadName: user.name,
      });

      return res.status(200).json({ msg: "Changed Project Head" });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;
