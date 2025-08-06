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
import type { Express } from "express";
import session from "express-session";
import * as config from "../config";
import type { User } from "../services/authent/user-repository";
import type { FlashMessage } from "./flash-message";
import type { ValidationError } from "express-validator";

/**
 * Adds session support to an Express application `app`.
 */
export function addSessionSupport(app: Express) {
    app.use(
        session({
            resave: false, // don't save session if unmodified
            saveUninitialized: true, // don't create session until something stored
            secret: config.APP_SECRET,
            name: "x-session-id",
            cookie: {
                sameSite: "strict",
            },
        }),
    );
}

// Extend Session types to please Typescript.
declare module "express-session" {
    export interface SessionData {
        user?: User;
        flashMessages?: FlashMessage[];
        errors: ValidationError[];
    }
}
