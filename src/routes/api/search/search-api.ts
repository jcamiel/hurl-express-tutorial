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
import express from "express";
import * as MovieService from "../../../services/movie/movie-service";
import { query, validationResult } from "express-validator";
import { toResultMovie } from "./result";
import type { Movie } from "../../../services/movie/movie";
import { Sort } from "../../../services/movie/movie-service";

const router = express.Router();

router.get(
    "/",
    query("q").exists().escape().trim(),
    query("sort").exists().optional().isIn(["name", "release", ""]),
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let sort: Sort = "name";
        if (req.query.sort == "release") {
            sort = "release";
        }

        const movies = MovieService.findMovies(req.query.q as string, sort);
        const resultMovies = movies.map((movie: Movie) => toResultMovie(movie));
        return res.json(resultMovies);
    },
);

export default router;
