import * as game from "./game";

// Kickstart everything
window.addEventListener("load", () => {
    let delayer = game.sleep(1000);
    game.screenlog("Loaded page");
    Promise.all([metaPromise, tilesPromise, delayer]).then(list => {
        game.gameload(list[0], list[1]);
    });
});

// Promises for loading files
let metaPromise = fetch("meta.json").then(resp => {
    return resp.json();
});

let tilesPromise = fetch("tiles.txt").then(resp => {
    return resp.text();
})