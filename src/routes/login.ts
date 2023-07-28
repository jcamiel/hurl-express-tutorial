import type { NextFunction, Request, Response } from "express";
import type { User } from "../services/authent/user-repository";
import express = require("express");
import { body, validationResult } from "express-validator";
import * as UserService from "../services/authent/user-service";
import csrf from "../core/csrf";
import { FlashMessageType } from "../core/flash-message";

const router = express.Router();

router.get("/", csrf, (req: Request, res: Response) => {
    let postUrl;
    if (typeof req.query.back == "string") {
        const param = encodeURIComponent(req.query.back);
        postUrl = `/login?back=${param}`;
    } else {
        postUrl = "/login";
    }

    res.render("login", {
        title: "Login",
        csrfToken: req.csrfToken(),
        postUrl: postUrl,
    });
});

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
    body("password", "Password must 6 to 32 chars long")
        .isLength({ min: 6, max: 32 })
        .trim()
        .escape(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (errors && !errors.isEmpty()) {
            req.session.errors = errors.array();
            res.redirect("/login");
            return;
        }

        UserService.authenticate(
            req.body.username,
            req.body.password,
            (user: User | null, err: Error | null) => {
                if (err) {
                    return next(err);
                }
                if (user) {
                    // Regenerate session when signing in to prevent fixation.
                    req.session.regenerate(() => {
                        req.session.user = user;
                        req.session.flashMessages = [
                            {
                                type: FlashMessageType.SUCCESS,
                                text: `Welcome back ${user.name}!`,
                            },
                        ];

                        // Whitelist of authorized redirect to prevent open redirects.
                        const whitelist = [/\/my-movies/, /\/movies\/.*/];
                        const defaultUrl = "/my-movies";
                        const backUrlParam = req.query.back;
                        let backUrl: string;
                        if (typeof backUrlParam == "string") {
                            backUrl = backUrlParam as string;
                        } else {
                            backUrl = defaultUrl;
                        }
                        if (whitelist.some((r) => backUrl.match(r))) {
                            res.redirect(backUrl);
                        } else {
                            res.redirect(defaultUrl);
                        }
                    });
                } else {
                    req.session.flashMessages = [
                        {
                            type: FlashMessageType.ERROR,
                            text: `Authentication failed, please check your username and password`,
                        },
                    ];
                    res.redirect("/login");
                }
            },
        );
    },
);

export default router;
