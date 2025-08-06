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
import type { Movie } from "../../services/movie/movie";

export interface FavoriteDto {
    readonly name: string;
    readonly id: string;
    readonly year: number;
    readonly director: string;
    readonly actors: string;
    readonly artwork: string | undefined;
    readonly url: string;
}

/**
 * Converts a `movie` instance to a `FavoriteDto`.
 */
export function toFavoriteDto(movie: Movie): FavoriteDto {
    let artwork;
    if (movie.artwork) {
        artwork = movie.artwork.replace("800x1200", "128x192");
    }

    const year = movie.releaseDate.getFullYear();
    return {
        name: movie.name,
        id: movie.slug,
        year: year,
        director: movie.director,
        actors: movie.actors.join(", "),
        artwork: artwork,
        url: `/movies/${movie.slug}`,
    };
}
