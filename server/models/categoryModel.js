const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
