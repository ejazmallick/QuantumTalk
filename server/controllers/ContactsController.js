import mongoose from 'mongoose';
import User from '../models/UserModel.js'; // Import User model
import Message from '../models/MessagesModel.js';

export const SearchContacts = async (req, res) => {
    try {
        console.log("📌 Received request from user:", req.user?.userId); // Debug log

        if (!req.user || !req.user.userId) { 
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }

        const { searchContacts } = req.body;

        let searchFilter = {}; // Default empty filter (fetch all users)
        
        if (searchContacts && typeof searchContacts === "string" && searchContacts.trim() !== "") {
            const sanitizedSearchTerm = searchContacts.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(sanitizedSearchTerm, 'i');

            searchFilter = { 
                $or: [{ name: regex }, { email: regex }] 
            };
        }

        // Fetch contacts excluding the logged-in user
        const contacts = await User.find({
            _id: { $ne: req.user.userId }, // Exclude logged-in user
            ...searchFilter
        }).select("name email image color"); // Include necessary fields

        return res.status(200).json({ contacts });

    } catch (error) {
        console.error("❌ Error searching contacts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getContactsForDMList = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }
        

        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                }
            },
            {
                $sort: { timestamp: -1 } // Sort messages by most recent first
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" }, // Fix incorrect timestamp selection
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                }
            },
            {
                $unwind: "$contactInfo" // Fix misplaced project block
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    contactName: "$contactInfo.name",
                    contactEmail: "$contactInfo.email",
                    contactImage: "$contactInfo.image",
                }
            },
            {
                $sort: { lastMessageTime: -1 } // Sort contacts by last message time
            }
        ]);

        return res.status(200).json({ contacts });

    } catch (error) {
        console.error("❌ Error fetching contacts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};