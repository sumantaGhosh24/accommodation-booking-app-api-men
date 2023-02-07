import {Category, Hotel} from "../models/index.js";

const categoryCtrl = {
  // get all categories
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      return res.json({categories});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // create category
  createCategory: async (req, res) => {
    try {
      const {name, image} = req.body;
      const category = await Category.findOne({name});
      if (category)
        return res.status(400).json({msg: "This category already created."});
      const newCategory = new Category({
        name: name.toLowerCase(),
        image,
      });
      await newCategory.save();
      return res.json({msg: "Category created."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // delete category
  deleteCategory: async (req, res) => {
    try {
      const hotels = await Hotel.findOne({category: req.params.id});
      if (hotels)
        return res
          .status(400)
          .json({msg: "Please delete all hotel of this category first"});
      await Category.findByIdAndDelete(req.params.id);
      return res.json({msg: "Category deleted."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // update category
  updateCategory: async (req, res) => {
    try {
      const {name, image} = req.body;
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        {name: name.toLowerCase(), image},
        {new: true}
      );
      if (!category)
        return res.status(400).json({msg: "This category does not exists."});
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
};

export default categoryCtrl;
