import express from 'express';
import {createsubCategory,getAllsubCategories,getsubCategoryById,updatesubCategory,deletesubCategory} from '../controllers/SubCateController.js'

const subCategoryroutes = express.Router();

subCategoryroutes.route("/").post(createsubCategory)
subCategoryroutes.route("/").get(getAllsubCategories)
subCategoryroutes.route("/:id").get(getsubCategoryById)
subCategoryroutes.route("/:id").put(updatesubCategory)
subCategoryroutes.route("/:id").delete(deletesubCategory)
export default subCategoryroutes;