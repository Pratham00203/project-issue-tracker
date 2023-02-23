const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  projectHead: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  clients: [
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
  companyPeople: [
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
    required: Date.now,
  },
});

module.exports = mongoose.model("project", ProjectSchema);
