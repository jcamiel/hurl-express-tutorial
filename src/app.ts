/*
 * Hurl (https://hurl.dev)
 * Copyright (C) 2025 Orange
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
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import * as config from "./config";
import { addSessionSupport } from "./core/session";
import type { Error } from "./core/error";
import { addRoutes } from "./routes/init";
import { addHandlebarsEngine } from "./core/handlebars";
import * as UserService from "./services/authent/user-service";
import * as FavoriteService from "./services/favorite/favorite-service";

export const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
addHandlebarsEngine(app);

app.use(logger("dev"));

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.APP_SECRET));

addSessionSupport(app);

// Static files
const options = { etag: true };
app.use(express.static(path.join(__dirname, "public"), options));

// Inject potential user in any response
app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.user = req.session.user;
    next();
});

// Flash messages
app.use((req: Request, res: Response, next: NextFunction) => {
    const messages = req.session.flashMessages;
    delete req.session.flashMessages;
    res.locals.flashMessages = messages;
    next();
});

// Error validations
app.use((req: Request, res: Response, next: NextFunction) => {
    const errors = req.session.errors;
    delete req.session.errors;
    res.locals.errors = errors;
    next();
});

// Deactivate ETag and cache for dynamic pages
app.set("etag", false);
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api")) {
        res.set("Cache-control", "no-store");
    }
    next();
});

addRoutes(app);

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

// Generic error handler, this must be the last middleware.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Set locals, only providing error in development
    res.status(err.status || 500);
    const sanitizedError = req.app.get("env") === "development" ? err : {};
    const message = err.message;
    res.locals.error = sanitizedError;
    res.locals.message = message;

    // Render the error page, depending on the request type
    if (req.accepts("html")) {
        res.render("error");
        return;
    }
    if (req.accepts("json")) {
        res.json(sanitizedError);
        return;
    }

    // Default to txt:
    res.type("txt").send(message);
});

// Create dummy users
const user0 = UserService.createUser(
    "bob78",
    "bob78@example.net",
    "Bob",
    "12345678",
);
FavoriteService.addFavorite(user0.id, 1);
FavoriteService.addFavorite(user0.id, 2);
FavoriteService.addFavorite(user0.id, 3);

const user1 = UserService.createUser(
    "fab",
    "fab@example.net",
    "Fabrice",
    "12345678",
);
FavoriteService.addFavorite(user1.id, 1);
FavoriteService.addFavorite(user1.id, 2);
FavoriteService.addFavorite(user1.id, 3);
