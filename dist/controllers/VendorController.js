"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFoods = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorCoverimage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const PasswordUtility_1 = require("../utility/PasswordUtility");
const models_1 = require("../models");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield AdminController_1.findVendor("", email);
    if (existingVendor !== null) {
        //validation and error
        const validation = yield PasswordUtility_1.ValidatePassword(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const signature = PasswordUtility_1.GenerateSignature({
                _id: existingVendor.id,
                email: existingVendor.email,
                foodTypes: existingVendor.foodType,
                name: existingVendor.name,
            });
            return res.json(signature);
        }
        else {
            return res.json({ message: "Password invalid" });
        }
    }
    return res.json({ message: "Login credentials not valid" });
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield AdminController_1.findVendor(user._id);
        return res.json(existingVendor);
    }
    return res.json({ message: "Vendor information not found." });
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { foodType, name, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield AdminController_1.findVendor(user._id);
        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;
            const saveResult = yield existingVendor.save();
            return res.json(saveResult);
        }
        return res.json(existingVendor);
    }
    return res.json({ message: "Vendor information not found." });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorCoverimage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield AdminController_1.findVendor(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vendor.coverImages.push(...images);
            const result = yield vendor.save();
            return res.json(result);
        }
    }
    return res.json({ message: "Something went wrong with add food." });
});
exports.UpdateVendorCoverimage = UpdateVendorCoverimage;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield AdminController_1.findVendor(user._id);
        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const savedResult = yield existingVendor.save();
            return res.json(savedResult);
        }
        return res.json(existingVendor);
    }
    return res.json({ message: "Vendor information not found." });
});
exports.UpdateVendorService = UpdateVendorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vendor = yield AdminController_1.findVendor(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createFood = yield models_1.food.create({
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
            const result = yield vendor.save();
            return res.json(result);
        }
    }
    return res.json({ message: "Something went wrong with add food." });
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.food.find({ vendorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ message: "Foods information Not Found." });
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=VendorController.js.map