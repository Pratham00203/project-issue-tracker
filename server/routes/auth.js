const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// @route    GET api/auth/
// @desc     Get current user
// @access   Private
app.get("/", auth, async (req, res) => {});

// @route    POST api/auth/client/login
// @desc     Client Login
// @access   Public
app.post("/client/login", async (req, res) => {});

// @route    POST api/auth/client/register
// @desc     Client Register
// @access   Public
app.post("/client/register", async (req, res) => {});

// @route    POST api/auth/company/login
// @desc     Company User Login
// @access   Public
app.post("/company/login", async (req, res) => {});

// @route    POST api/auth/company/register
// @desc     Company User registration
// @access   Public
app.post("/company/register", async (req, res) => {});

module.exports = router;
