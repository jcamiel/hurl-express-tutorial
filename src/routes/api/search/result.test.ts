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
import { Movie } from "../../../services/movie/movie";
import { ResultMovie, toResultMovie } from "./result";

test("returns a result form a movie", () => {
    const movie: Movie = {
        id: 1,
        name: "Conan the Barbarian",
        artwork: "conan-the-barbarian-800x1200.jpg",
        slug: "conan-the-barbarian",
        director: "John Milius",
        writers: ["John Milius", "Oliver Stone"],
        runningTimes: 129,
        releaseDate: new Date("1982-05-14"),
        actors: [
            "Arnold Schwarzenegger",
            "James Earl Jones",
            "Sandahl Bergman",
            "Ben Davidson",
            "Cassandra Gaviola",
            "Gerry Lopez",
            "Mako",
            "Valerie Quennessen",
            "William Smith",
            "Max von Sydow",
        ],
        boxOffice: {
            min: 68900000,
            max: 79100000,
        },
        links: {
            wikipedia:
                "https://en.wikipedia.org/wiki/Conan_the_Barbarian_(1982_film)",
            imdb: "https://www.imdb.com/title/tt0082198/",
        },
    };
    const result = toResultMovie(movie);
    const expected: ResultMovie = {
        name: "Conan the Barbarian",
        url: "/movies/conan-the-barbarian",
        director: "John Milius",
        release_date: "1982-05-14",
        actors: [
            "Arnold Schwarzenegger",
            "James Earl Jones",
            "Sandahl Bergman",
            "Ben Davidson",
            "Cassandra Gaviola",
            "Gerry Lopez",
            "Mako",
            "Valerie Quennessen",
            "William Smith",
            "Max von Sydow",
        ],
        artwork: "/img/conan-the-barbarian-800x1200.jpg",
        artwork_128: "/img/conan-the-barbarian-128x192.jpg",
    };
    expect(result).toStrictEqual(expected);
});
