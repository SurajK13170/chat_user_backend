const userModel = require("../model/user.model");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const JWT_SECRET = process.env.key;

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Email is already in use" });
        }
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: "Password must be strong" });
        }
        const newUser = new userModel({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        await newUser.save();
        res.status(200).json({
            _id: newUser._id,
            name,
            email,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(200).json({ msg: "Login success",user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const findUser = async(req, res)=>{
    const userId = req.params.userId
    try{
        const user = await userModel.findById(userId)
        res.status(200).json(user)
    }catch(err){
        res.status(404).json("user not found")
    }
}

const getUser = async(req, res)=>{
    try{
        const user = await userModel.find()
        res.status(200).json(user)
    }catch(err){
        res.status(404).json("user not found")
    }
}

module.exports = {registerUser, loginUser, findUser, getUser};
