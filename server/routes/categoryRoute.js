const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");

// Get all categories
router.get("/get-categories", async (req, res) => {
  try {
    const categories = await Category.find({}, "code name"); // Specify the fields to retrieve
    res.send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add a new category
router.post("/add-category", async (req, res) => {
    try {
      const { name, code } = req.body;
  
      if (!name || !code) {
        return res.status(400).json({ message: "Name and code are required" });
      }
  
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
      }
  
      const newCategory = new Category({ name, code });
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  


// DELETE a category
router.delete("/delete-category/:categoryId", async (req, res) => {
    try {
        const { categoryId } = req.params;
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// PUT route to update a category
router.put("/edit-category/:categoryId", async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, code} = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name, code}, { new: true });
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
