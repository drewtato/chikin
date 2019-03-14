window.addEventListener("load", () => {
    Promise.all([metaPromise, tilesPromise]).then(list => {
        gameload(list[0], list[1]);
    })
});

const TILEMAP = {
    " ": 0,
    ".": 1,
    "c": 2
};
const WALL = 1;
const CHIKIN = 2;

let metaPromise = fetch("meta.json").then(resp => {
    return resp.json();
});

let tilesPromise = fetch("tiles.txt").then(resp => {
    return resp.text();
}).then(tilestring => {
    let tiles = [];
    for (let line of tilestring.split("\n")) {
        let row = [];
        for (let c of line) {
            let id = TILEMAP[c];
            row.push(id);
        }
        tiles.push(row);
    }
    return tiles;
});

function gameload(meta, tiles) {
    
}
