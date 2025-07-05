import { request } from "http";
import Message from "../models/MessagesModel.js";
import { mkdirSync, rename } from 'fs';

export const getMessages = async (req, res) => {
    try {
        const user1 = req.userId;  
        const user2 = req.body?.id; 

        if (!user1 || !user2) {
            return res.status(400).json({ error: "Both user IDs are required." });
        }

        console.log(`📥 Fetching messages between ${user1} and ${user2}`);

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        })
        .sort({ timestamp: 1 })
        .populate("sender recipient", "username email");

        console.log(`✅ Fetched ${messages.length} messages`);

        return res.status(200).json({ messages });
    } catch (error) {
        console.error("❌ Error fetching messages:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required");
        }
        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${fileDir}/${req.file.originalname}`;

        mkdirSync(fileDir, { recursive: true });

        rename(req.file.path, fileName, (err) => {
            if (err) {
                console.error("❌ Error moving file:", err);
                return res.status(500).json({ error: "Error moving file", details: err.message });
            }
        });

        return res.status(200).json({ filePath: fileName });
    } catch (error) {
        console.error("❌ Error in uploadFile:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
