/*
 * Hurl (https://hurl.dev)
 * Copyright (C) 2023 Orange
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import type { Request, Response } from "express";
import { param } from "express-validator";
import * as UserService from "../../../services/authent/user-service";
import express from "express";

const router = express.Router();

router.delete(
    "/:username",
    param("username", "Username must be 4 to 32 chars long")
        .isLength({ min: 4, max: 32 })
        .trim()
        .escape(),
    (req: Request, res: Response) => {
        const username = req.params.username;
        const user = UserService.findUserByUsername(username);
        if (!user) {
            return res
                .status(404)
                .json({ message: `No user with username ${username}` });
        }
        UserService.deleteUser(username);
        res.status(200).json({});
    },
);

export default router;
