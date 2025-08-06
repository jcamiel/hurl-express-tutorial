import ButtonFavorite from "./button-favorite.js";

const buttons = document.querySelectorAll(".button-favorite-container");
if (buttons) {
    [...buttons].forEach((el) => {
        /* eslint-disable no-undef */
        Vue.createApp({
            components: {
                ButtonFavorite,
            },
        }).mount(el);
    });
}
