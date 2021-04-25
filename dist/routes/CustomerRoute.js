"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const middlewares_1 = require("../middlewares");
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.CustomerRoute = router;
/* ----------------------- Signup / Create Customer ----------------------- */
router.post('/signup', controllers_1.CustomerSignUp);
/* ---------------------------- Login ------------------------------ */
router.post('/login', controllers_1.CustomerLogin);
//Authentication
router.use(middlewares_1.Authenticate);
/* ----------------------- Verify Customer Route ---------------------------- */
router.patch('/verify', controllers_1.CustomerVerify);
/* ----------------------- OTP / Requesting RoOTPute ---------------------------- */
router.get('/otp', controllers_1.RequestOTP);
/* ----------------------- Profile ---------------------------- */
router.get('/profile', controllers_1.GetCustomerProfile);
router.patch('/profile', controllers_1.EditCustomerProfile);
//# sourceMappingURL=CustomerRoute.js.map