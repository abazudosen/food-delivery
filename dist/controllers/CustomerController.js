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
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Customer_dto_1 = require("../dto/Customer.dto");
const PasswordUtility_1 = require("../utility/PasswordUtility");
const models_1 = require("../models");
const NotificationUtility_1 = require("../utility/NotificationUtility");
const PasswordUtility_2 = require("../utility/PasswordUtility");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = class_transformer_1.plainToClass(Customer_dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield class_validator_1.validate(customerInputs, {
        validationError: { target: true },
    });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInputs;
    const salt = yield PasswordUtility_1.GenerateSalt();
    const userPassword = yield PasswordUtility_1.GeneratePassword(password, salt);
    const { otp, expiry } = NotificationUtility_1.GenerateOTP();
    console.log(otp, expiry);
    const existCustomer = yield models_1.Customer.findOne({ email: email });
    if (existCustomer !== null) {
        return res.status(400).json({
            message: 'A User already exist with the provided email ID'
        });
    }
    const result = yield models_1.Customer.create({
        email: email,
        password: userPassword,
        phone: phone,
        salt: salt,
        otp: otp,
        otp_expiry: expiry,
        firstName: "",
        lastName: "",
        address: "",
        verified: false,
        lat: 0,
        lng: 0,
    });
    if (result) {
        // send the OTP to customer
        yield NotificationUtility_1.onRequestOTP(otp, phone);
        // generate the signature
        const signature = PasswordUtility_1.GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified,
        });
        // send the result to client
        return res.status(201).json({
            signature: signature,
            verified: result.verified,
            email: result.email,
            text: 'working smoothly.....'
        });
    }
    return res.status(400).json({ message: 'Error with Signup' });
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = class_transformer_1.plainToClass(Customer_dto_1.UserLoginInputs, req.body);
    const loginErrors = yield class_validator_1.validate(loginInputs, { validationError: { target: false } });
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors);
    }
    const { email, password } = loginInputs;
    const customer = yield models_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield PasswordUtility_2.ValidatePassword(password, customer.password, customer.salt);
        if (validation) {
            // generate the signature
            const signature = PasswordUtility_1.GenerateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified,
            });
            // send the result to client
            return res.status(201).json({
                signature: signature,
                verified: customer.verified,
                email: customer.email,
            });
        }
        // else {
        //   return res.status(201).json({ message: 'Password does not exist ' })
        // }
    }
    return res.status(404).json({ message: 'Login error' });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = yield profile.save();
                //generate the signature
                const signature = PasswordUtility_1.GenerateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
                return res.status(201).json({
                    signature: signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email,
                });
            }
        }
    }
    return res.status(400).json({ message: 'Error with OTP Validation' });
});
exports.CustomerVerify = CustomerVerify;
const RequestOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = NotificationUtility_1.GenerateOTP();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield NotificationUtility_1.onRequestOTP(otp, profile.phone);
            res.status(200).json({ message: 'OTP sent to your registered phone number' });
        }
    }
    return res.status(400).json({ message: 'Error with OTP Request' });
});
exports.RequestOTP = RequestOTP;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ message: 'Error with Fetching Profile' });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = class_transformer_1.plainToClass(Customer_dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield class_validator_1.validate(profileInputs, { validationError: { target: false } });
    if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstname = firstName;
            profile.lastname = lastName;
            profile.address = address;
            const result = yield profile.save();
            res.status(200).json(result);
        }
    }
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map