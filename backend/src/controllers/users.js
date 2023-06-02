import User from "../models/User.js";

export const getUserById = async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.id).select("-password").select("-refreshToken");
        if (!foundUser) {
            return res.status(404).json({ message: "User not found." });
        }
        
        res.status(200).json(foundUser);
    } catch (error) {
        res.status(400).json({ message: "Unable to get the data about this user" });
    }
};

export const updateUser = async (req, res) => {
    try {
        if (!req.body?.username || !req.body?.fullName) {
            return res.status(400).json({ message: "Username and full name are required"});
        }

        let avatar = "";
        if (req?.file) {
            avatar = process.env.NODE_ENV==="dev" ? req.protocol + "://" + req.hostname + `:${process.env.PORT}/uploads/users/` + req.file.filename : process.env.BACKEND_SERVER_PROD + "/uploads/users/" + req.file.fileName;
        }

        const updatedInfo = {
            ...req.body,
            avatar
        };
        const foundUser = await User.findByIdAndUpdate(req.params.id, updatedInfo, { new: true });
        res.status(200).json(foundUser);
    } catch (error) {
        res.status(400).json({ message: "Unable to update the user" });
    }
};
