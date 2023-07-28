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
import type { Movie } from "../../../services/movie/movie";
import { toISO8601Short } from "../../../utils/date";

export interface ResultMovie {
    readonly name: string;
    readonly url: string;
    readonly director: string;
    readonly release_date: string;
    readonly actors: string[];
    readonly artwork: string | undefined;
    readonly artwork_128: string | undefined;
}

/**
 * Converts a `Movie` instance to a `ResultMovie`.
 * @param movie Instance to be converted.
 */
export function toResultMovie(movie: Movie): ResultMovie {
    // TODO: specify base url for url and resources.
    let artwork128;
    if (movie.artwork) {
        artwork128 = movie.artwork.replace("800x1200", "128x192");
    }

    return {
        name: movie.name,
        url: `/movies/${movie.slug}`,
        director: movie.director,
        release_date: toISO8601Short(movie.releaseDate),
        actors: movie.actors,
        artwork: `/img/${movie.artwork}`,
        artwork_128: `/img/${artwork128}`,
    };
}
