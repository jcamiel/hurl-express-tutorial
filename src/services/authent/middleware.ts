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
import type { NextFunction, Request, Response } from "express";

/**
 * Middleware for authenticated endpoint.
 * If the endpoint returns HTML, the unauthenticated user are redirected to /login.
 * If the endpoint returns JSON, the response is a 401, to be managed by the client.
 */
function authenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        next();
    } else {
        if (req.baseUrl.startsWith("/api")) {
            console.log("Authenticated access needed, returns 401");
            res.status(401).json({ message: "Unauthorized" });
        } else {
            console.log("Authenticated access needed, redirect to login");
            res.redirect("/login");
        }
    }
}

export default authenticated;
