import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
//import { compare } from "bcrypt";
//import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};


/// SIGNUP

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (email && password) {
      const user = await User.create({ email, password });
      response.cookie("jwt", createToken(email, user.id), {
        maxAge,
        secure: true,
        sameSite: "None",
      });

      return response.status(201).json({
        user: {
          id: user?.id,
          email: user?.email,
         // firstName: user.firstName,
         // lastName: user.lastName,
         // image: user.image,
          profileSetup: user.profileSetup,
        },
      });
    } else {
      return response.status(400).send("Email and Password Required");
    }
  } catch (err) {
    console.log(err);
    return response.status(500).send("Internal Server Error");
  }
};


// LOGIN
export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) { return response.status(400).send("Email and Password Required")}

    const user = await User.findOne({ email });
    if (!user) { return response.status(400).send("User with given email not found")}

    const auth = await compare(password, user.password);
    if (!auth) { return response.status(400).send("Password is incorrect")}

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(201).json({
      user: {
        id: user?.id,
        email: user?.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetup: user.profileSetup,
      },
    });
  
  } catch (err) {
    console.log(err);
    return response.status(500).send("Internal Server Error");
  }
};
/*
export const getUserInfo = async (request, response, next) => {
  try {
    if (request.userId) {
      const userData = await User.findById(request.userId);
      if (userData) {
        return response.status(200).json({
          id: userData?.id,
          email: userData?.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          image: userData.image,
          profileSetup: userData.profileSetup,
          color: userData.color,
        });
      } else {
        return response.status(404).send("User with the given id not found.");
      }
    } else {
      return response.status(404).send("User id not found.");
    }
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};


/// LOGOUT
export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return response.status(200).send("Logout successful");
  } catch (err) {
    return response.status(500).send("Internal Server Error");
  }
};



/// UPDATE PROFILE
export const updateProfile = async (request, response, next) => {
  try {
    const { userId } = request;

    const { firstName, lastName, color } = request.body;

    if (!userId) {
      return response.status(400).send("User ID is required.");
    }

    if (!firstName || !lastName) {
      return response.status(400).send("Firstname and Last name is required.");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      profileSetup: userData.profileSetup,
      color: userData.color,
    });
  } catch (error) {
    return response.status(500).send("Internal Server Error.");
  }
};

export const addProfileImage = async (request, response, next) => {
  try {
    if (request.file) {
      const date = Date.now();
      let fileName = "uploads/profiles/" + date + request.file.originalname;
      renameSync(request.file.path, fileName);
      const updatedUser = await User.findByIdAndUpdate(
        request.userId,
        { image: fileName },
        {
          new: true,
          runValidators: true,
        }
      );
      return response.status(200).json({ image: updatedUser.image });
    } else {
      return response.status(404).send("File is required.");
    }
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error.");
  }
};

export const removeProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;

    if (!userId) {
      return response.status(400).send("User ID is required.");
    }

    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).send("User not found.");
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return response
      .status(200)
      .json({ message: "Profile image removed successfully." });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error.");
  }
};
*/