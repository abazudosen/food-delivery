import { Request, Response, NextFunction } from "express";
import { VendorLoginInput, EditVendorInputs } from "../dto";
import { findVendor } from "./AdminController";
import { CreateFoodInput } from "../dto/Food.dto";
import {
  GenerateSignature,
  ValidatePassword,
} from "../utility/PasswordUtility";
import { food } from "../models";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;

  const existingVendor = await findVendor("", email);

  if (existingVendor !== null) {
    //validation and error
    const validation = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: existingVendor.id,
        email: existingVendor.email,
        foodTypes: existingVendor.foodType,
        name: existingVendor.name,
      });

      return res.json(signature);
    } else {
      return res.json({ message: "Password invalid" });
    }
  }

  return res.json({ message: "Login credentials not valid" });
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await findVendor(user._id);

    return res.json(existingVendor);
  }
  return res.json({ message: "Vendor information not found." });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodType, name, address, phone } = <EditVendorInputs>req.body;

  const user = req.user;

  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor !== null) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodType;

      const saveResult = await existingVendor.save();
      return res.json(saveResult);
    }

    return res.json(existingVendor);
  }
  return res.json({ message: "Vendor information not found." });
};

export const UpdateVendorCoverimage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vendor = await findVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File]

      const images = files.map((file: Express.Multer.File) => file.filename)

      vendor.coverImages.push(...images)
      
      const result = await vendor.save();

      return res.json(result);
    }
  }
  return res.json({ message: "Something went wrong with add food." });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }

    return res.json(existingVendor);
  }
  return res.json({ message: "Vendor information not found." });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const { name, description, category, foodType, readyTime, price } = <CreateFoodInput>req.body;
    const vendor = await findVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File]

      const images = files.map((file: Express.Multer.File) => file.filename)

      const createFood = await food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        images: images,
        readyTime: readyTime,
        price: price,
        rating: 0,
      });

      vendor.foods.push(createFood);
      const result = await vendor.save();

      return res.json(result);
    }
  }
  return res.json({ message: "Something went wrong with add food." });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await food.find({ vendorId: user._id });

    if (foods !== null) {
      return res.json(foods);
    }
  }
  return res.json({ message: "Foods information Not Found." });
};