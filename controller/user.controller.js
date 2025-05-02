import User from "../model/User.model.js"
import cryto from "crypto"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";


const registerUser = async (req, res) => {
  const {name, email, password } =req.body;
  if((!name || !email || !password)){
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  try{
    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.status(400).json({
        message: "User already exists"
      })
    }
    const user = await User.create({
      name,
      email, 
      password
    })

    console.log(user);

    const token = cryto.randomBytes(32).toString("hex")
    console.log(token);
    user.verificationToken = token;

    await user.save()

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Verify your email",
      text: `Please click on the following link: ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
    };

    await transporter.sendMail(mailOption)

    res.status(201).json({
      message: "User registered successfully",
      success: true
    })
    


  } catch(error){
    res.status(400).json({
      message: "User not registered ",
      error: error.message,
      success: false
    });
  }
};

const verifyUser = async(req, res) => {
   //get token from url
   //validate
   //find user based on token
   //if not set isVerified to true
   //remove verification token
   //save
   //return response

   const {token} =req.params;
   console.log(token);
   if(!token){
    return res.status(400).json({
      message: "Invalid token"
    })
   }
   const user =await User.findOne({verificationToken : token})
   if(!token){
    return res.status(400).json({
      message: "Invalid token"
    })
   }
   user.isVerified = true
   user.verificationToken = undefined
   await user.save()

}

const login = async (req, res) => {
  const {email, password} = req.body

  if(!email || !password){
    return res.status(400).json({
      message: "All fields are required"
    })
  }

  try{
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({
        message: "Invalid email or password",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    console.log(isMatch)

    if(!isMatch){
      return res.status(400).json({
        message: "Invalid email or password",
      })
    }

    const token = jwt.sign(
      {id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {expiresIn: '24h'}
    )

    const cookieOption = {
      httpOnly: true,
      secure: true,
      maxAge: 24*60*60*1000
    }
    res.cookie("token",token, cookieOption)
    res.status(200).json({
      sucess: true, 
      token,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch(error){
    return res.status(400).json({
      message: "Login failed",
      error: error.message,
      success: false
    });
  }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    if(!user){
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log("error in getme", error)
  }
}

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {});
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    
  }
}

const forgotPassword = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}

const resetPassword = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}

export { registerUser, verifyUser, login, getMe, logout, forgotPassword, resetPassword};