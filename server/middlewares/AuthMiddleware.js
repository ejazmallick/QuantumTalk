import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("🔍 Incoming Auth Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("❌ No valid token provided");
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("❌ JWT Verification Failed:", err.message);
                return res.status(403).json({ error: "Forbidden - Invalid Token" });
            }

            console.log("✅ Token Verified Successfully:", decoded);
            req.user = decoded; // Ensure `req.user` is properly set
            next();
        });
    } catch (error) {
        console.error("❌ Token Processing Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
