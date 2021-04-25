"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const VendorController_1 = require("../controllers/VendorController");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VendorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    }
});
const images = multer_1.default({ storage: imageStorage }).array('images', 10);
router.post("/login", VendorController_1.VendorLogin);
router.use(middlewares_1.Authenticate);
router.get("/profile", VendorController_1.GetVendorProfile);
router.patch("/profile", VendorController_1.UpdateVendorProfile);
router.patch("/coverimage", images, VendorController_1.UpdateVendorCoverimage);
router.patch("/service", VendorController_1.UpdateVendorService);
router.post("/food", images, VendorController_1.AddFood);
router.get("/foods", VendorController_1.GetFoods);
router.get("/", (req, res, next) => {
    res.json({ message: "Hello from Vendor" });
});
//# sourceMappingURL=VendorRoute.js.map