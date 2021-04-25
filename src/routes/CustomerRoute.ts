import { Authenticate } from '../middlewares';
import express, { Request, Response, NextFunction } from "express";
import { CustomerLogin, CustomerSignUp, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOTP } from "../controllers";


const router = express.Router()

/* ----------------------- Signup / Create Customer ----------------------- */
router.post('/signup', CustomerSignUp)

/* ---------------------------- Login ------------------------------ */
router.post('/login', CustomerLogin)


//Authentication
router.use(Authenticate)

/* ----------------------- Verify Customer Route ---------------------------- */
router.patch('/verify', CustomerVerify)

/* ----------------------- OTP / Requesting RoOTPute ---------------------------- */
router.get('/otp', RequestOTP)

/* ----------------------- Profile ---------------------------- */
router.get('/profile', GetCustomerProfile)

router.patch('/profile', EditCustomerProfile)

export {router as CustomerRoute} 