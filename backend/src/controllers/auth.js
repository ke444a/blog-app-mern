import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateJwtToken = (userId, TOKEN_SECRET, expiryTime) => {
    return jwt.sign(
        { id: userId },
        TOKEN_SECRET,
        { expiresIn: expiryTime }
    );
};

export const register = async (req, res) => {
    const registeringUser = req.body;
    if (!registeringUser.username || !registeringUser.password || !registeringUser.fullName) {
        return res.status(400).json({ message: "Username, password, and full name are required." });
    }

    const existingUser = await User.findOne({ username: registeringUser.username });
    if (existingUser) {
        return res.status(409).json({ message: "User with the given username already exists!"});
    }

    try {
        const refreshToken = generateJwtToken(registeringUser._id, process.env.REFRESH_TOKEN_SECRET, "1d");
        const accessToken = generateJwtToken(registeringUser._id, process.env.ACCESS_TOKEN_SECRET, "5s");
        
        const hashedPassword = await bcrypt.hash(registeringUser.password, 10);
        registeringUser.refreshToken = refreshToken;
        const newUser = new User({
            ...registeringUser,
            password: hashedPassword
        });
        await newUser.save();
        
        res.cookie("jwt", refreshToken, { httpOnly:true, secure: true, sameSite: "None", maxAge: 24*60*60*1000});
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            fullName: newUser.fullName,
            accessToken: accessToken
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: "User with given username is not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid password." });
    }

    try {
        const accessToken = generateJwtToken(user._id, process.env.ACCESS_TOKEN_SECRET, "5s");
        const refreshToken = generateJwtToken(user._id, process.env.REFRESH_TOKEN_SECRET, "1d");
        user.refreshToken = refreshToken;
        const result = await user.save();
        res.cookie("jwt", refreshToken, { httpOnly:true, secure: true, sameSite: "None", maxAge: 24*60*60*1000});
        res.status(200).json({ user: result, accessToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
};

export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ message: "No refresh token!" });
    }

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        return res.status(200).json({ message: "No user with given refresh token"} );
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: err.message });
            }
            const accessToken = generateJwtToken(decoded.id, process.env.ACCESS_TOKEN_SECRET, "5s");
            res.status(201).json({ accessToken });
        }
    );
};