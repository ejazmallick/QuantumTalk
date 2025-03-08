import User from '../models/UserModel.js'; // Import User model


export const SearchContacts = async (req, res) => {

    try {
        console.log("📌 Received request with user:", req.user); // Debug log

        if (!req.user || !req.user.userId) { // Use `userId` instead of `_id` if needed
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }

        const { searchContacts } = req.body;
        if (!searchContacts || typeof searchContacts !== "string" || searchContacts.trim() === "") {
            return res.status(400).json({ error: "searchContacts is required and must be a non-empty string" });
        }

        const sanitizedSearchTerm = searchContacts.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(sanitizedSearchTerm, 'i');

        const contacts = await User.find({
            _id: { $ne: req.user.userId }, // Use `userId` from token
            $or: [{ name: regex }, { email: regex }],
        }).select("name email");

        return res.status(200).json({ contacts });

    } catch (error) {
        console.error("❌ Error searching contacts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
