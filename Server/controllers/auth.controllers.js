import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenandSetCookie from "../utils/jwt.js";
export const signup = async (req, res) => {
  try {
    const { fullname, username, password, gender, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already exists!" });
    }

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const boyprofilepic = `https://avatar.iran.liara.run/public/boy`;
    const girlprofilepic = `https://avatar.iran.liara.run/public/girl`;

    const newUser = new User({
      fullname,
      username,
      password: hashedpassword,
      gender,
      profilepic: gender === "male" ? boyprofilepic : girlprofilepic,
    });
    if (newUser) {
      generateTokenandSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilepic: newUser.profilepic,
        message:"Signed in successfully"
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const{username,password}=req.body;
    const user=await User.findOne({username});
    const isPasswordCorrect=await bcrypt.compare(password,user?.password || "");

    if(!user || !isPasswordCorrect){
        return res.status(400).json({error:"Invalid Username or Password"});
    }
    generateTokenandSetCookie(user._id,res);

    res.status(200).json({
        _id:user._id,
        username:user.username,
        fullname:user.fullname,
        profilepic:user.profilepic,
        message:"logged in successfully"
    })



  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Loggedout successfully"})
  } catch (error) {}
};
