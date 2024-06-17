import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadImage } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //check if user already exists - username an email
  //files exist or not such avatar
  //upload them to cloudinary, avatar
  //create user object - create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  //get user details from front-end
  const { username, fullName, email, password} = req.body;

  //validation-not empty
  if (fullName === "") {
    throw new ApiError(400, "fullname is required");
  }

  if (username === "") {
    throw new ApiError(400, "username is required");
  }

  if (email === "") {
    throw new ApiError(400, "email is required");
  }

  if (password === "") {
    throw new ApiError(400, "password is required");
  }

  // checks the database to avoid data redundancy
  const existingUser = await User.findOne({
    $or: [{username},{email}]
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = await req.files?.avatar[0]?.path;
  const coverLocalPath = await req.files?.cover?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatarImage = await uploadImage(avatarLocalPath);
  const coverImage = await uploadImage(coverLocalPath);

  if (!avatarImage) {
    throw new ApiError(400, "Avatar image is required.9");
  }

  const user = await User.create({
    fullName : fullName,
    avatar : avatarImage.url,
    coverImage : coverImage?.url || "",
    email : email,
    password : password,
    username : username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering user")
  }

  return res.status(201).json(
    new ApiResponse(200, "User Registered Successfully", createdUser)
  )

});

export { registerUser };
