const mongoose = require("mongoose");

const IssueSchema = mongoose.Schema({
  shortSummary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reporterName: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  estimateInHours: {
    type: Number,
    default: 0,
  },
  assignees: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: {
        type: String,
      },
      projectRole: {
        type: String,
      },
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now,
  },
  closedOn: {
    type: Date,
  },
  attachments: [
    {
      type: String,
    },
  ],
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    default: "Backlog",
  },
  responseMsg: {
    type: String,
  },
  responseSentOn: {
    type: Date,
  },
});

module.exports = mongoose.model("issue", IssueSchema);
