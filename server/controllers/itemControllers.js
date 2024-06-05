const itemModel = require("../models/itemModels");

// get items
const getItemController = async (req, res, next) => {
    try {
      const items = await itemModel.find();
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      next(error); // pass the error to the error handler middleware
    }
  };
  

//add items
const addItemController = async (req, res, next) => {
  try {
    const { name, price, category, image } = req.body;

    const lastItem = await itemModel.find({ category }).sort({ createdAt: -1 }).limit(1);
    let newItemCode;

    if (lastItem.length === 0) {
      newItemCode = `${category.toUpperCase()}0001`;
    } else {
      const lastItemCode = lastItem[0].itemCode;
      const numberPart = parseInt(lastItemCode.replace(category.toUpperCase(), '')) + 1;
      newItemCode = `${category.toUpperCase()}${String(numberPart).padStart(4, '0')}`;
    }

    const newItem = new itemModel({
      name,
      price,
      category,
      image,
      itemCode: newItemCode,
    });

    await newItem.save();
    res.status(201).send("Item created successfully!");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//update item
const editItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await itemModel.findOneAndUpdate({ _id: itemId }, req.body, {
      new: true,
    });

    res.status(201).json("item Updated");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//delete item
const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await itemModel.findOneAndDelete({ _id: itemId });
    res.status(200).json("item Deleted");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
};