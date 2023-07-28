/* eslint-disable no-undef */
Vue.createApp({
    data() {
        return {
            search: "",
            movies: [],
            hasSearched: false,
        };
    },
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        this.search = urlParams.get("q") || "";
        if (this.search !== "") {
            this.fetchMovie(this.search);
        }
    },
    computed: {
        resultsTitle() {
            if (this.movies.length >= 2) {
                return `${this.movies.length} results`;
            } else if (this.movies.length === 1) {
                return `1 result`;
            } else if (this.hasSearched) {
                return "No result";
            } else {
                return "";
            }
        },
    },
    methods: {
        onInput() {
            // Set the query param to the input value
            const url = new URL(window.location.href);
            url.searchParams.set("q", this.search);
            window.history.replaceState(null, null, url);

            this.fetchMovie(this.search);
        },
        fetchMovie(search) {
            if (this.search.length <= 2) {
                this.movies = [];
                return;
            }
            this.hasSearched = true;
            const url = new URL("/api/search", window.location.origin);
            url.searchParams.append("q", search);
            fetch(url.toString())
                .then((response) => response.json())
                .then((data) => (this.movies = data));
        },
        getReleaseYear(movie) {
            return new Date(movie.release_date).getFullYear();
        },
        highlight(value) {
            const re = RegExp(`(${this.search})`, "ig");
            return value.replace(re, '<span class="highlight">$1</span>');
        },
        highlightActors(movie) {
            return this.highlight(movie.actors.join(", "));
        },
        highlightReleaseDate(movie) {
            const year = new Date(movie.release_date).getFullYear().toString();
            return this.highlight(year);
        },
        highlightName(movie) {
            return this.highlight(movie.name);
        },
        highlightDirector(movie) {
            return this.highlight(movie.director);
        },
    },
    template: `
<div>
        <form class="search-form row" @submit.prevent>
            <input 
                placeholder="Dark Crystal, Harrison Ford, 1986..."
                class="col search-input" 
                type="text" 
                @input="onInput" 
                v-model="search"
                id="search-input"
            />
        </form>
        
        <h3 v-if="resultsTitle.length">{{resultsTitle}}</h3>
        
        <ul class="search-results">
            <li v-for="movie in movies">
                <div class="search-result-movie flex align-items-center">
                    <div>
                        <a :href="movie.url">
                            <img class="search-result-thumbnail" :src="movie.artwork_128" :alt="movie.name" width=100 height=150>
                        </a> 
                    </div>
                    <div class="search-result-crew">
                        <div>
                            <b v-html="highlightName(movie)"></b> (<span class="search-result-year" v-html="highlightReleaseDate(movie)"></span>)
                        </div>
                        <div><b>Directors:</b> <span v-html="highlightDirector(movie)"></span></div>
                        <div><b>Actors:</b> <span v-html="highlightActors(movie)"></span></div>
                    </div>
                </div>
            </li>
        </ul>
</div>
`,
}).mount("#search");
