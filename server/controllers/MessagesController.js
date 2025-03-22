import Message from "../models/MessagesModel.js";

export const getMessages = async (req, res) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if(!user1 || !user2) {
            return res.status(400).json("Both user ID's are requitrted." );
        }
       
        const  messages  = await Message.find({
           $or : [
            { sender: user1, receiver: user2 },
            { sender: user2, receiver: user1 },
           ],
        }).sort({timestamp : 1});

        return res.status(200).json({ messages });

    } catch (error) {
        console.error( error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
