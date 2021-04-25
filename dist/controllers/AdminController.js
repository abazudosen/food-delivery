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
exports.GetVendorById = exports.GetVendors = exports.CreateVendor = exports.findVendor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const findVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vendor.findOne({ email: email });
    }
    else {
        return yield models_1.Vendor.findById(id);
    }
});
exports.findVendor = findVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pincode, foodType, email, password, ownerName, phone, } = req.body;
    const existingVendor = yield exports.findVendor('', email);
    if (existingVendor !== null) {
        return res.json({ message: "A vendor already exists with this email ID" });
    }
    //generate a salt
    const salt = yield utility_1.GenerateSalt();
    const userPassword = yield utility_1.GeneratePassword(password, salt);
    // encrypt the password using the salt
    const createdVendor = yield models_1.Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        foods: []
    });
    return res.json(createdVendor);
});
exports.CreateVendor = CreateVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find();
    if (vendors !== null) {
        return res.json(vendors);
    }
    return res.json({ 'message': 'vendors data not available' });
});
exports.GetVendors = GetVendors;
const GetVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    const vendor = yield exports.findVendor(vendorId);
    if (vendor !== null) {
        return res.json(vendor);
    }
    return res.json({ 'message': 'vendors data not available' });
});
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminController.js.map