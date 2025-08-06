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
import favoriteRepository from "./favorite-repository";
import * as MovieService from "../../services/movie/movie-service";
import { Movie } from "../movie/movie";

/**
 * Adds a movie to the user's favorites movies.
 *
 * Always returns `true`.
 */

export function addFavorite(userId: string, movieId: number): boolean {
    if (!isFavorite(userId, movieId)) {
        favoriteRepository.push({ userId: userId, movieId: movieId });
    }

    return true;
}

/**
 * Removes a movie from the user's favorites movies.
 *
 * Always returns `true`.
 */
export function removeFavorite(userId: string, movieId: number): boolean {
    // Check if this movie is already in user's favorites.
    const favoriteIndex = favoriteRepository.findIndex(
        (favorite) => favorite.userId == userId && favorite.movieId == movieId,
    );
    if (favoriteIndex != -1) {
        favoriteRepository.splice(favoriteIndex, 1);
    }

    return true;
}

/**
 * Returns true if a movie is one of user's favorites movies.
 */
export function isFavorite(userId: string, movieId: number): boolean {
    const favorite = favoriteRepository.find(
        (favorite) => favorite.userId == userId && favorite.movieId == movieId,
    );
    return favorite != undefined;
}

/**
 * Returns the user's favorites movies count.
 */
export function favoritesCount(userId: string): number {
    const favorites = favoriteRepository.filter(
        (favorite) => favorite.userId == userId,
    );
    return favorites.length;
}

/**
 * Returns the user's favorites movies.
 */
export function findFavoriteMovies(
    userId: string,
    from: number,
    to: number,
): Movie[] {
    return favoriteRepository
        .filter((favorite) => favorite.userId == userId)
        .map((favorite) => MovieService.findMovieById(favorite.movieId))
        .filter((movie) => movie != undefined)
        .sort((a, b) =>
            (a as Movie).name.localeCompare((b as Movie).name, "en"),
        )
        .slice(from, to + 1) as Movie[];
}
