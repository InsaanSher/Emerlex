const express = require("express");
const multer = require("multer");
const {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
} = require("./../controllers/itemControllers");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

//routes
//Method - get
router.get("/get-item", getItemController);

//Method - POST
router.post("/add-item", upload.single('file'), addItemController);

//method - PUT
router.put("/edit-item", upload.single('file'), editItemController);

//method - DELETE
router.post("/delete-item", deleteItemController);

module.exports = router;
