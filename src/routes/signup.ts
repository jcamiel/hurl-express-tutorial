import type { Request, Response } from "express";
import express = require("express");
import { body, validationResult } from "express-validator";
import type { CustomValidator } from "express-validator";
import csrf from "../core/csrf";
import * as UserService from "../services/authent/user-service";
import { FlashMessageType } from "../core/flash-message";

const router = express.Router();

router.get("/", csrf, (req: Request, res: Response) => {
    res.render("signup", {
        title: "Sign up",
        csrfToken: req.csrfToken(),
    });
});

const isValidUserEmail: CustomValidator = (value) => {
    const user = UserService.findUserByEmail(value);
    if (user) {
        throw new Error("E-mail already in use");
    }
    return value;
};

const isValidUsername: CustomValidator = (value) => {
    const user = UserService.findUserByUsername(value);
    if (user) {
        throw new Error("Username already in use");
    }
    return value;
};

router.post(
    "/",
    csrf,
    body("username", "Username must be 3 to 32 chars long")
        .isLength({ min: 3, max: 32 })
        .trim()
        .escape(),
    body("username", "Username must use a-z, A-Z, 0-9 or _ -").matches(
        /^[a-zA-Z\d_-]{3,32}$/,
    ),
    body("username", "Username already in use").custom(isValidUsername),
    body("password", "Password must 6 to 32 chars long")
        .isLength({ min: 6, max: 32 })
        .trim()
        .escape(),
    body("email", "Password must 6 to 32 chars long").isEmail(),
    body("email", "E-mail already in use").custom(isValidUserEmail),
    body("name", "Name must be 3 to 32 chars long")
        .isLength({ min: 3, max: 32 })
        .trim()
        .escape(),
    body("name", "Name must use a-z, A-Z, 0-9 or space -").matches(
        /^[a-zA-Z\d\s-]{3,32}$/,
    ),

    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (errors && !errors.isEmpty()) {
            console.log("Error creating user");
            console.info(errors);
            req.session.errors = errors.array();
            res.redirect("/signup");
            return;
        }

        const user = UserService.createUser(
            req.body.username,
            req.body.email,
            req.body.name,
            req.body.password,
        );

        // Regenerate session when signing in to prevent fixation.
        req.session.regenerate(() => {
            req.session.user = user;
            req.session.flashMessages = [
                {
                    type: FlashMessageType.SUCCESS,
                    text: `Welcome ${user.name}!`,
                },
            ];
            res.redirect("/my-movies");
        });
    },
);

export default router;
