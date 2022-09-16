const users = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// register
const register= async (req, res) => {
  const { name, email, password, password_confirmation, mobile, profession } =
    req.body;
  const preuser = await users.findOne({ email: email });
  if (preuser) {
    res.status(404).json({ message: "this is user is already present" });
  } else {
    if (
      name &&
      email &&
      password &&
      password_confirmation &&
      mobile &&
      profession
    ) {
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(12);
          const hashPassword = await bcrypt.hash(password, salt);
          const adduser = new users({
            name,
            email,
            password: hashPassword,
            mobile,
            profession,
          });
          await adduser.save();
          const userData = await users.findOne({ email: email });
          // Generate JWT Token
          const token = jwt.sign(
            { userId: userData._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }
          );
          res
            .status(201)
            .json({ message: "Registeration success", token: token });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "unable to Register" });
        }
      } else {
        res
          .status(404)
          .json({ message: "password and conform password doesn't match" });
      }
    } else {
      res.status(404).json({ message: "All field are required" });
    }
  }
};

//login

const login =async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const user = await users.findOne({ email: email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          // Generate JWT Token
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }
          );

          res.status(200).json({ message: "Login success", Token: token });
        } else {
          res.status(400).json({ message: "Email or Password is not Valid" });
        }
      } else {
        res.status(200).json({ message: "you are not a Register User" });
      }
    } else {
      res.status(400).json({ message: "plz fill the data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// get userdata

const userData= async (req, res) => {
  try {
    const userdata = await users.find();
    res.status(201).json(userdata);
    //console.log(userdata);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: err.message });
  }
};

// get individual user

const getUserById = async (req, res) => {
  try {
   // console.log(req.params);
    const { id } = req.params;

    const userindividual = await users.findById({ _id: id });
    console.log(userindividual);
    res.status(201).json(userindividual);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// update user data

const updateUser = async (req, res) => {
  try {
    const _id  = req.params.id;

    const updateduser = await users.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    console.log(updateduser);
    res.status(201).json(updateduser);
    //const _id = req.params.id
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// delete user
const deleteUser= async (req, res) => {
try{
    
const deleteUser = await users.findByIdAndDelete(req.params.id)
if(!req.params.id){
    res.status(404).json({message:"valid id"})
}
res.json({message:"deleted User successfully"})
}catch(error){
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
}
};

module.exports={register,login,userData,getUserById,updateUser,deleteUser}