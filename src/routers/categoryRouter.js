import express from "express";

import {categoryCtrl} from "../controllers/index.js";
import {auth, authAdmin} from "../middleware/index.js";

const router = express.Router();

// get all categories and create category
router
  .route("/category")
  .get(categoryCtrl.getCategories)
  .post(auth, authAdmin, categoryCtrl.createCategory);

// delete category and update category
router
  .route("/category/:id")
  .delete(auth, authAdmin, categoryCtrl.deleteCategory)
  .put(auth, authAdmin, categoryCtrl.updateCategory);

export default router;
