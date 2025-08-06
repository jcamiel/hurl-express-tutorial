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
import hbs = require("hbs");
import type { Express } from "express";

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import handlebars_helper_range = require("handlebars-helper-range");

function eq<T>(v1: T, v2: T): boolean {
    return v1 === v2;
}

function ne<T>(v1: T, v2: T): boolean {
    return v1 !== v2;
}

function lt<T>(v1: T, v2: T): boolean {
    return v1 < v2;
}

function gt<T>(v1: T, v2: T): boolean {
    return v1 > v2;
}

function lte<T>(v1: T, v2: T): boolean {
    return v1 <= v2;
}

function gte<T>(v1: T, v2: T): boolean {
    return v1 >= v2;
}

function add(v1: number, v2: number): number {
    return v1 + v2;
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
function section(name, options) {
    // @ts-ignore
    if (!this.sections) this.sections = {};

    // @ts-ignore
    this.sections[name] = options.fn(this);
    return null;
}

/**
 * Sets Handlebars template engine and registers basic helpers to this `app`.
 */
export function addHandlebarsEngine(app: Express) {
    app.set("view engine", "hbs");
    hbs.registerHelper("eq", eq);
    hbs.registerHelper("ne", ne);
    hbs.registerHelper("lt", lt);
    hbs.registerHelper("gt", gt);
    hbs.registerHelper("lte", lte);
    hbs.registerHelper("gte", gte);
    hbs.registerHelper("add", add);
    hbs.registerHelper("section", section);
    hbs.registerHelper("range", handlebars_helper_range);
}
