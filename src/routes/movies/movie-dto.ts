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
import { Movie } from "../../services/movie/movie";

export interface MovieDto {
    readonly name: string;
    readonly id: string;
    readonly year: number;
    readonly director: string;
    readonly writers: string;
    readonly actors: string;
    readonly artwork: string | undefined;
    readonly releaseDate: string;
    readonly runningTimes: number;
    readonly url: string;
    readonly imdbUrl: string;
    readonly wikipediaUrl: string;
}

/**
 * Converts a `movie` instance to a `MovieDto`.
 */
export function toMovieDto(movie: Movie): MovieDto {
    const month = movie.releaseDate.toLocaleString("en-US", { month: "long" });
    const year = movie.releaseDate.getFullYear();
    const day = movie.releaseDate.getDate();
    const releaseDateFormatted = `${month} ${day}, ${year}`;
    return {
        name: movie.name,
        id: movie.slug,
        year: year,
        director: movie.director,
        writers: movie.writers.join(", "),
        actors: movie.actors.join(", "),
        artwork: movie.artwork,
        releaseDate: releaseDateFormatted,
        runningTimes: movie.runningTimes,
        url: `/movies/${movie.slug}`,
        imdbUrl: movie.links.imdb || "",
        wikipediaUrl: movie.links.wikipedia || "",
    };
}
