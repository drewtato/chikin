// Kickstart everything
window.addEventListener("load", () => {
    let delayer = sleep(1000);
    screenlog("Loaded page");
    Promise.all([metaPromise, tilesPromise, delayer]).then(list => {
        gameload(list[0], list[1]);
    });
});
window.addEventListener("resize", updateSize);

// Promises for loading files
let metaPromise = fetch("meta.json").then(resp => {
    return resp.json();
});

let tilesPromise = fetch("tiles.txt").then(resp => {
    return resp.text();
})

// Generic sleep promise
function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

// Log items to screen (instead of console.log)
function screenlog(strs) {
    logdiv = document.getElementById("screenlog");
    logitem = document.createElement("p");
    if (!Array.isArray(strs)) {
        strs = [strs];
    }
    for (let str of strs) {
        if (str === undefined) {
            logitem.innerHTML += "undefined";
        } else if (typeof str === "object") {
            logitem.innerHTML += JSON.stringify(str);
        } else {
            logitem.innerHTML += str.toString();
        }
        logitem.innerHTML += ' ';
    }
    logdiv.appendChild(logitem);
    logdiv.scrollTop = logdiv.scrollHeight;
}

// animate from https://javascript.info/js-animation 
// under CC-BY-NC-SA with modifications
function animate(duration, timing, draw) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
        // timeFraction goes from 0 to 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1)
            timeFraction = 1;
        if (timeFraction < 0)
            timeFraction = 0;
        // calculate the current animation state
        let progress = timing(timeFraction);
        draw(progress); // draw it
        if (timeFraction < 1)
            requestAnimationFrame(animate);
    });
}

async function animawait(duration, timing, draw) {
    animate(duration, timing, draw);
    await sleep(duration);
}

// Set size of game area based on window size
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

// Reformat tile data for lookups
function getTileData(meta) {
    let tiledata = meta.tiles;
    let tilecodes = {};
    for (let tiletype in tiledata) {
        tilecodes[tiledata[tiletype].code] = tiletype;
    }
    return [tiledata, tilecodes];
}

function createTile(t, tiledata) {
    let tile = emptyTile();
    if (t in tiledata) {
        let image = new Image();
        image.src = tiledata[t].img;
        tile.appendChild(image);
    }
    return tile;
}

function emptyTile() {
    let tile = document.createElement("div");
    tile.classList.add("t");
    return tile;
}

function drawWorld(world, tiles, duration, tiledata) {
    let domtiles = document.createElement("div")
    domtiles.classList.add("tileContainer");
    for (let row of tiles) {
        let domrow = document.createElement("div")
        domrow.classList.add("worldRow");
        for (let t of row) {
            let tile = createTile(t, tiledata);
            domrow.appendChild(tile);
        }
        domtiles.appendChild(domrow);
    }
    world.appendChild(domtiles)
    animate(duration, t => t, progress => {
        domtiles.style.opacity = progress;
    });
}

function setPos(world, pos) {
    world.style.setProperty(
        "--y",
        `calc(${-pos[0]} * var(--size) / var(--proportion))`
    );
    world.style.setProperty(
        "--x",
        `calc(${-pos[1]} * var(--size) / var(--proportion))`
    );
}

async function keydown(world, pressed, pos) {
    while (pressed.length) {
        screenlog(pressed);
        let ydif = 0;
        let xdif = 0;
        switch (pressed[0]) {
            case "w": ydif = -1;
                break;
            case "s": ydif = 1;
                break;
            case "a": xdif = -1;
                break;
            case "d": xdif = 1;
                break;
            default:
                return;
        }
        let oldpos = pos.slice();
        await animawait(180, t => t, progress => {
            let newpos = [oldpos[0] + ydif * progress, oldpos[1] + xdif * progress];
            setPos(world, newpos);
        });
        pos[0] += ydif;
        pos[1] += xdif;
    }
};

function parseTileTxt(tiletxt, tilecodes, chikincode) {
    let pos = [0,0];
    let tiles = [];
    let rows = tiletxt.split("\n");
    for (let y = 0; y < rows.length; y++) {
        let row = rows[y].split("");
        let chikinpos = row.indexOf(chikincode);
        if (chikinpos >= 0) {
            pos = [y, chikinpos];
        }
        tiles.push(row.map(c => tilecodes[c]));
    }
    
    return [tiles, pos];
}

async function gameload(meta, tiletxt) {
    // Deal with tile info
    let datacodes = getTileData(meta);
    let tiledata = datacodes[0];
    let tilecodes = datacodes[1];
    // screenlog(["tiledata:", tiledata]);
    let tilesandpos = parseTileTxt(tiletxt, tilecodes, meta.characters.chikin.code);
    tiles = tilesandpos[0];
    pos = tilesandpos[1];
    
    // Set up game area
    updateSize();
    let area = document.getElementById("game");
    let world = document.createElement("div");
    world.classList.add("world");
    area.innerHTML = "";
    area.appendChild(world);
    
    // Place chikin
    setPos(world, pos);
    chikinImg = new Image();
    chikinImg.src = meta.characters.chikin.img;
    chikinImg.classList.add("chikin");
    chikinImg.alt = "chikin";
    area.appendChild(chikinImg);
    
    screenlog("Loaded game");
    // screenlog(["tiles:", tiles]);
    
    // Fade in things
    await animawait(500, t => t, progress => {
        chikinImg.style.opacity = progress;
    });
    await animate(1000, t => t, progress => {
        world.style.opacity = progress;
    });
    // Fade in world
    drawWorld(world, tiles, 1000, tiledata);
    screenlog("Done");
    
    // Keypress handlers
    let pressed = [];
    let running = false;
    window.onkeyup = (e) => {
        let i = pressed.indexOf(e.key);
        if (i >= 0) {
            pressed.splice(i, 1);
        }
    };
    window.onkeydown = async function push(e) {
        if (pressed.indexOf(e.key) === -1) {
            pressed.push(e.key);
        }
        if (running) {
            return;
        }
        running = true;
        await keydown(world, pressed, pos);
        running = false;
    };
}
