import express from "express";
import * as itemController from "../controllers/itemController.js";
import { checkAuth } from "../middleware/auth.js";
const router = express.Router();
router.get("/", checkAuth, itemController.getItems);
router.post("/add", checkAuth, itemController.addItem);
router.put("/:id", checkAuth, itemController.editItem);
router.delete("/:id", checkAuth, itemController.deleteItem);

export default router;
