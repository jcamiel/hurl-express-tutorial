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
import type { Request, Response } from "express";
import express from "express";
import { query, validationResult } from "express-validator";
import authenticated from "../../services/authent/middleware";
import * as FavoriteService from "../../services/favorite/favorite-service";
import { toFavoriteDto } from "./favorite-dto";

const router = express.Router();

router.get(
    "/",
    authenticated,
    query("page").isInt({ min: 1 }).toInt().optional(),
    (req: Request, res: Response) => {
        let currentPage = 1;
        if (validationResult(req).isEmpty() && req.query.page) {
            currentPage = req.query.page as unknown as number;
        }
        const userId = req.session.user!.id;

        const count = FavoriteService.favoritesCount(userId);
        const moviesPerPage = 8;
        const pages = Math.max(1, Math.floor((count - 1) / moviesPerPage) + 1);
        currentPage = Math.min(currentPage, pages);
        const from = (currentPage - 1) * moviesPerPage;
        const to = currentPage * moviesPerPage - 1;

        const favorites = FavoriteService.findFavoriteMovies(
            userId,
            from,
            to,
        ).map((movie) => toFavoriteDto(movie));

        res.render("user/my-movies", {
            title: "My Movies",
            favorites: favorites,
            pages: pages,
            currentPage: currentPage,
        });
    },
);

export default router;
