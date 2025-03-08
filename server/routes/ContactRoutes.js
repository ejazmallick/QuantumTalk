import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js"; // ✅ Ensure correct path
import { SearchContacts } from "../controllers/ContactsController.js"; // ✅ Ensure correct path

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, SearchContacts); // ✅ Requires token

export default contactsRoutes;
