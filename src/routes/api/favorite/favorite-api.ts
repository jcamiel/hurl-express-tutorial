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
import express = require("express");
import authenticated from "../../../services/authent/middleware";
import * as MovieService from "../../../services/movie/movie-service";
import * as FavoriteService from "../../../services/favorite/favorite-service";

const router = express.Router();

router.put("/", authenticated, (req: Request, res: Response) => {
    const selected = req.body.selected;
    const movieSlug = req.body.movie_id;
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const userId = req.session.user!.id; // request is authenticated so user is not null

    const movie = MovieService.findMovieBySlug(movieSlug);
    if (!movie) {
        res.status(400).json({ message: `No movie with id ${movieSlug}` });
        return;
    }

    let ret;
    if (selected) {
        ret = FavoriteService.addFavorite(userId, movie.id);
    } else {
        ret = FavoriteService.removeFavorite(userId, movie.id);
    }
    if (ret) {
        res.status(200).json({ movie_id: movieSlug, selected: selected });
    } else {
        res.status(400).json({ message: `Unable to process ${movieSlug}` });
    }
});

export default router;
