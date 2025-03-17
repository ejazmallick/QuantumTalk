import User from '../models/UserModel.js'; // Import User model

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
