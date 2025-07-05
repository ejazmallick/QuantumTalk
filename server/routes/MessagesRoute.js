
// import {Router } from 'express';
// import { getMessages } from "../controllers/MessagesController.js";
// import { verifyToken } from "../middlewares/AuthMiddleware.js";




// const messagesRoutes = Router();
 
// messagesRoutes.post("/get-messages", verifyToken, getMessages );

// export default messagesRoutes;

import { Router } from 'express';
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from 'multer';

const messagesRoutes = Router();
const upload = multer({dest : "uploads/files"});

// ✅ Use `GET` instead of `POST` for fetching messages
messagesRoutes.get("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFile);

export default messagesRoutes;
