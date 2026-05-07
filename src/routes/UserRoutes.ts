import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { CreateUserDto } from "../dto/CreateUser.dto.js"; 

const router = Router();
router.post(
    "/users",
     validationMiddleware(CreateUserDto),
     UserController.create
);

router.get("/users", UserController.getAll);

export default router;