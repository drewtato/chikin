window.addEventListener("load", () => {
    let delayer = sleep(1000);
    console.log("Loaded page");
    Promise.all([metaPromise, tilesPromise, delayer]).then(list => {
        gameload(list[0], list[1]);
    });
});

window.addEventListener("resize", updateSize);

function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

let metaPromise = fetch("meta.json").then(resp => {
    return resp.json();
});

const EMPTY = 0;
const FENCE = 1;
const FENCEL = 5;
const FENCER = 6;
const CHIKIN = 2;
const APPLE = 3;
const ROCK = 4
const TILEMAP = {
    " ": EMPTY,
    "-": FENCE,
    "[": FENCEL,
    "]": FENCER,
    "c": CHIKIN,
    "a": APPLE,
    "r": ROCK,
};

let tilesPromise = fetch("tiles.txt").then(resp => {
    return resp.text();
}).then(tilestring => {
    let tiles = [];
    for (let line of tilestring.split("\n")) {
        let row = [];
        for (let c of line) {
            let id = TILEMAP[c];
            if (id !== undefined)
                row.push(id);
        }
        if (row.length)
            tiles.push(row);
    }
    return tiles;
});

// animate from https://javascript.info/js-animation 
// under CC-BY-NC-SA with modifications
function animate(duration, timing, draw) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
        // timeFraction goes from 0 to 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1)
            timeFraction = 1;
        // calculate the current animation state
        let progress = timing(timeFraction);
        draw(progress); // draw it
        if (timeFraction < 1)
            requestAnimationFrame(animate);
    });
}

function updateSize() {
    let gameArea = document.getElementById("game");
    let tileProportion = 15;
    h = Math.floor(gameArea.clientHeight * 0.9);
    w = Math.floor(gameArea.clientWidth * 0.9);
    size = Math.min(h, w);
    style = gameArea.style;
    style.setProperty("--proportion", `${tileProportion}`);
    style.setProperty("--size", `${size}px`);
}

function getChikinPos(tiles) {
    for (let y = 0; y < tiles.length; y++) {
        for (let x = 0; x < tiles[y].length; x++) {
            if (tiles[y][x] === 2) {
                return [y, x];
            }
        }
    }
}

function createTile(t, meta) {
    let tile
    switch (t) {
        case ROCK:
            tile = rockTile(meta);
            break;
        case FENCE: 
            tile = fenceTile(meta);
            break;
        case FENCEL:
            tile = fenceLTile(meta);
            break;
        case FENCER:
            tile = fenceRTile(meta);
            break;
        case APPLE:
            tile = appleTile(meta);
            break;
        default:
            console.log("Invalid tile " + t);
        case EMPTY:
        case CHIKIN:
            tile = emptyTile();
    };
    return tile;
}

function emptyTile() {
    let div = document.createElement("div");
    div.classList.add("t", "empty");
    return div;
}
function rockTile(meta) {
    let div = emptyTile();
    let image = new Image();
    image.src = meta["imgs"]["rock"];
    div.appendChild(image);
    return div;
}
function appleTile(meta) {
    let div = emptyTile();
    let image = new Image();
    image.src = meta["imgs"]["apple"];
    div.appendChild(image);
    return div;
}
function fenceTile(meta) {
    let div = emptyTile();
    let image = new Image();
    image.src = meta["imgs"]["fence"];
    div.appendChild(image);
    return div;
}
function fenceLTile(meta) {
    let div = emptyTile();
    let image = new Image();
    image.src = meta["imgs"]["fence_left"];
    div.appendChild(image);
    return div;
}
function fenceRTile(meta) {
    let div = emptyTile();
    let image = new Image();
    image.src = meta["imgs"]["fence_right"];
    div.appendChild(image);
    return div;
}

function drawWorld(world, tiles, duration, meta) {
    let domtiles = document.createElement("div")
    domtiles.classList.add("tileContainer");
    for (let row of tiles) {
        let domrow = document.createElement("div")
        domrow.classList.add("worldRow");
        for (let t of row) {
            let tile = createTile(t, meta);
            domrow.appendChild(tile);
        }
        domtiles.appendChild(domrow);
    }
    world.appendChild(domtiles)
    animate(duration, t => t, progress => {
        domtiles.style.opacity = progress;
    });
}

async function gameload(meta, tiles) {
    console.log("Loaded game");
    console.log(meta);
    console.log(tiles);
    let area = document.getElementById("game");
    let world = document.createElement("div");
    world.classList.add("world");
    updateSize();
    area.innerHTML = "";
    area.appendChild(world);
    animate(1000, t => t, progress => {
        world.style.opacity = progress;
    });
    await sleep(1000);
    chikinImg = new Image();
    chikinImg.src = meta["imgs"]["birb"];
    chikinImg.classList.add("chikin");
    chikinImg.alt = "chikin";
    area.appendChild(chikinImg);
    animate(1000, t => t, progress => {
        chikinImg.style.opacity = progress;
    });
    await sleep(1000);
    let pos = getChikinPos(tiles);
    world.style.setProperty("--y", `calc(${-pos[0]} * var(--size) / var(--proportion))`);
    world.style.setProperty("--x", `calc(${-pos[1]} * var(--size) / var(--proportion))`);
    drawWorld(world, tiles, 2000, meta);
    
    console.log("Done");
    
    window.onkeydown = (e) => {
        console.log(e.key)
        switch (e.key) {
            case "ArrowUp": pos[0]--;
                break;
            case "ArrowDown": pos[0]++;
                break;
            case "ArrowLeft": pos[1]--;
                break;
            case "ArrowRight": pos[1]++;
                break;
        }
        world.style.setProperty("--y", `calc(${-pos[0]} * var(--size) / var(--proportion))`);
        world.style.setProperty("--x", `calc(${-pos[1]} * var(--size) / var(--proportion))`);
    };
}
