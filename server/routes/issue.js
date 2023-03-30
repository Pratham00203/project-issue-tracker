const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Issue = require("../models/Issue");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/attachments");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// @route    POST api/issue/:projectid/create/new
// @desc     Create a Issue
// @access   Private
router.post(
  "/:projectid/create/new",
  upload.array("attachments", 5),
  auth,
  async (req, res) => {
    try {
      let attachments = [];
      if (req.files) {
        req.files.map((f) =>
          attachments.push(f.destination + "/" + f.filename)
        );
      }

      const {
        shortSummary,
        description,
        priority,
        estimateInHours,
        assignees,
        status,
      } = req.body;
      let reporter = req.user.id;
      let user = await User.findById(req.user.id, { name: 1 });
      let reporterName = user.name;
      let issue = new Issue({
        shortSummary,
        description,
        priority,
        estimateInHours,
        assignees,
        status,
        reporter,
        reporterName,
        projectId: req.params.projectid,
        attachments,
      });
      await issue.save();
      return res.status(200).json({ msg: "Issue Created" });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Server Error" });
    }
  }
);

// @route    GET api/issue/:projectid/issues/all
// @desc     Get all issues of a project
// @access   Private
router.get("/:projectid/issues/all", auth, async (req, res) => {
  try {
    const issues = await Issue.find({ projectId: req.params.projectid });

    return res.status(200).json({
      issues,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    GET api/issue/:projectid/:issueid
// @desc     Get a specific issue
// @access   Private
router.get("/:projectid/:issueid", auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueid);

    return res.status(200).json({
      issue,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    POST api/issue/respond/:projectid/:issueid
// @desc     Respond to a issue
// @access   Private
router.post("/respond/:projectid/:issueid", auth, async (req, res) => {
  try {
    //Implementation required
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    PUT api/issue/update/issue/:issueid
// @desc     Update a issue
// @access   Private
router.put("/update/issue/:issueid", auth, async (req, res) => {
  try {
    let closedOn;
    const {
      shortSummary,
      description,
      priority,
      estimateInHours,
      assignees,
      status,
    } = req.body;

    if (status === "Closed") {
      closedOn = new Date().toISOString();

      await Issue.findByIdAndUpdate(req.params.issueid, {
        shortSummary: shortSummary,
        description: description,
        priority: priority,
        estimateInHours: estimateInHours,
        assignees: assignees,
        status: status,
        closedOn: closedOn,
      });
    } else {
      await Issue.findByIdAndUpdate(req.params.issueid, {
        shortSummary: shortSummary,
        description: description,
        priority: priority,
        estimateInHours: estimateInHours,
        assignees: assignees,
        status: status,
      });
    }

    return res.status(200).json({ msg: "Issue Updated" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    DELETE api/issue/delete/issue/:issueid
// @desc     Delete a Issue
// @access   Private
router.delete("/delete/issue/:issueid", auth, async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.issueid);

    return res.status(200).json({ msg: "Issue Deleted" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// @route    GET api/issue/:projectid/download/issues/all
// @desc     Get all issues to download
// @access   Private
router.get("/:projectid/download/issues/all", auth, async (req, res) => {
  try {
    const issues = await Issue.find(
      { projectId: req.params.projectid, status: { $ne: "Closed" } },
      { reporter: 0, projectId: 0, responseMsg: 0, responseSentOn: 0 }
    );

    let downloadIssues = [];

    issues.forEach((i) => {
      let obj = {
        "Short Summary": i["shorSummary"],
        Description: i["description"],
        "Reported By": i["reporterName"],
        Priority: i["priority"],
        "Estimated Time to Complete (In Hours)": i["estimateInHours"],
        "Assigned To": i["assignees"],
        Attachments: i["attachments"],
        "Created On": i["createdOn"],
        Status: i["status"],
      };
      downloadIssues.push(obj);
    });

    return res.status(200).json({
      downloadIssues,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
