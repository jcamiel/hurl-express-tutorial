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
import { Movie } from "../../services/movie/movie";
import { MovieDto, toMovieDto } from "./movie-dto";

test("returns a dto form a movie", () => {
    const movie: Movie = {
        id: 1,
        name: "Conan the Barbarian",
        artwork: "conan-the-barbarian.jpg",
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
    const movieDto = toMovieDto(movie);
    const expected: MovieDto = {
        name: "Conan the Barbarian",
        id: "conan-the-barbarian",
        year: 1982,
        director: "John Milius",
        writers: "John Milius, Oliver Stone",
        actors: "Arnold Schwarzenegger, James Earl Jones, Sandahl Bergman, Ben Davidson, Cassandra Gaviola, Gerry Lopez, Mako, Valerie Quennessen, William Smith, Max von Sydow",
        artwork: "conan-the-barbarian.jpg",
        releaseDate: "May 14, 1982",
        runningTimes: 129,
        url: "/movies/conan-the-barbarian",
        imdbUrl: "https://www.imdb.com/title/tt0082198/",
        wikipediaUrl:
            "https://en.wikipedia.org/wiki/Conan_the_Barbarian_(1982_film)",
    };
    expect(movieDto).toStrictEqual(expected);
});
