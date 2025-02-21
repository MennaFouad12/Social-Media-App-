import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as userService from "./user.service.js"; 
import * as userValidation from "./user.validation.js";
import {validation} from "../../middleware/validation.middleware.js"
import { fileValidation, upload, uploadCloud } from "../../utils/file uploading/multerUpload.js";

const router = Router();
router.get("/profile", authentication(),asyncHandler(userService.getProfile));
router.get(
  "/profile/:profileId",
  validation(userValidation.shareProfileSChema),
  authentication(),
  asyncHandler(userService.shareProfile)
);
router.patch(
  "/profile/email",
  validation(userValidation.updateEmailSChema),
  authentication(),
  asyncHandler(userService.updateEmail)
);
router.patch(
  "/profile/reset_email",
  validation(userValidation.resetEmailSChema),
  authentication(),
  asyncHandler(userService.resetEmail)
);
router.patch(
  "/updatePassword",
  validation(userValidation.updatePasswordSchema),
  authentication(),
  asyncHandler(userService.updatePassword)
);
router.patch(
  "/updateProfile",
  validation(userValidation.updateProfileSchema),
  authentication(),
  asyncHandler(userService.updateProfile)
)


router.post(
  "/profilePicture",
  authentication(),
  upload(fileValidation.images,"upload/user").single("image"),
  asyncHandler(userService.uploadImageDisk)
)
router.post(
  "/multipleImages",
  authentication(),
  upload(fileValidation.images,"upload/user").array("images",3),
  asyncHandler(userService. uploadMultipleImages)
)

router.delete(
  "/deleteImages",
  authentication(),
  upload(fileValidation.images,"upload/user").single("image"),
  asyncHandler(userService.deleteProfileImages)
)

router.post(
  "/uploadCloud",
  authentication(),
  uploadCloud(fileValidation.images,"upload/user").single("image"),
  asyncHandler(userService.uploadOnCloud)
)
export default router;
