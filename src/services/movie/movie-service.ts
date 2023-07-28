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
import { Movie } from "./movie";
import * as MovieRepository from "./movie-repository";

/**
 * Returns a movie by `slug`, or `undefined` if no match.
 */
export function findMovieBySlug(slug: string): Movie | undefined {
    return MovieRepository.movies.find((movie) => movie.slug == slug);
}

/**
 * Returns a movie by primary `id`, or `undefined` if no match.
 */
export function findMovieById(id: number): Movie | undefined {
    return MovieRepository.movies.find((movie) => movie.id == id);
}

export type Sort = "name" | "release";
/**
 * Returns a list of movie that matches a `search` term. If no match, returns an empty list.
 *
 * Movies ares sorted: use "name" for sorting by name or "release" for sorting by release date.
 */
export function findMovies(search: string, sort: Sort): Movie[] {
    const searchNormalized = search.toLowerCase();
    const results = MovieRepository.movies.filter(
        (movie) =>
            movie.name.toLowerCase().includes(searchNormalized) ||
            movie.releaseDate
                .getFullYear()
                .toString()
                .includes(searchNormalized) ||
            movie.actors.some((actor) =>
                actor.toLowerCase().includes(searchNormalized),
            ) ||
            movie.director.toLowerCase().includes(searchNormalized),
    );

    switch (sort) {
        case "name": {
            results.sort((a: Movie, b: Movie) =>
                a.name.localeCompare(b.name, "en-US"),
            );
            break;
        }
        case "release": {
            results.sort(
                (a: Movie, b: Movie) =>
                    a.releaseDate.valueOf() - b.releaseDate.valueOf(),
            );
            break;
        }
    }
    return results;
}
