// Interfaces
interface metadata {
    tiles: {
        [key: string]: {
            img: string;
            code: string;
            size: string;
        };
    };
    background: {
        [key: string]: {
            img: string;
            code: string;
            size: string;
        };
    };
    characters: {
        [key: string]: {
            img: string;
            code: string;
            size: string;
        };
    };
}

// Generic sleep promise
function sleep(miliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

// Log items to screen (instead of console.log)
function screenlog(strs: any) {
    let logdiv = document.getElementById("screenlog");
    if (logdiv === null) {
        console.log(strs);
        return;
    }
    let logitem = document.createElement("p");
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
function animate(duration: number, timing: (t: number) => number, draw: (progress: number) => any) {
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

async function animawait(duration: number, timing: (t: number) => number, draw: (progress: number) => any) {
    animate(duration, timing, draw);
    await sleep(duration);
}

function parseTileTxt(tiletxt: string, tilecodes: {
    [key: string]: string
}, chikincode: any) {
    let pos = [0, 0];
    let tiles = [];
    let rows = tiletxt.split("\n");
    let y;
    for (y = 0; y < rows.length; y++) {
        let row = rows[y].split("");
        if (row[0] === ':') {
            break;
        }
        let chikinpos = row.indexOf(chikincode);
        if (chikinpos >= 0) {
            pos = [y, chikinpos];
        }
        tiles.push(row.map((c: string | number) => tilecodes[c]));
    }

    let fgtiles = []
    for (y++; y < rows.length; y++) {
        let row = rows[y].split(" ");
        let code = row[0];
        let coords = row[1].split(",").map((n: string) => parseInt(n, 10));
        fgtiles.push([tilecodes[code], coords]);
    }

    return [tiles, fgtiles, pos];
}

// Set size of game area based on window size
function updateSize() {
    let gameArea = document.getElementById("game");
    if (gameArea === null) {
        throw "No game area";
    }
    let tileProportion = 10;
    let h = Math.floor(gameArea.clientHeight * 0.9);
    let w = Math.floor(gameArea.clientWidth * 0.9);
    let size = Math.min(h, w);
    let style = gameArea.style;
    style.setProperty("--proportion", `${tileProportion}`);
    style.setProperty("--size", `${size}px`);
}

// Reformat tile data for lookups
function getTileData(meta: metadata) {
    let tiledata = meta.tiles;
    let tilecodes: {
        [key: string]: string
    } = {};
    for (let tiletype in tiledata) {
        tilecodes[tiledata[tiletype].code] = tiletype;
    }
    return {
        data: tiledata,
        codes: tilecodes
    };
}

function createTile(t: string, tiledata: {
    [key: string]: {
        size: number[];img: string
    };
}) {
    let tile = emptyTile();
    if (t in tiledata) {
        let image = new Image();
        image.src = tiledata[t].img;
        tile.appendChild(image);
        if ("size" in tiledata[t]) {
            image.style.setProperty("height", `calc(var(--tile) * ${tiledata[t].size[0]})`)
            image.style.setProperty("width", `calc(var(--tile) * ${tiledata[t].size[1]})`)
        }
    }
    return tile;
}

function emptyTile() {
    let tile = document.createElement("div");
    tile.classList.add("t");
    return tile;
}

function drawWorld(world: HTMLDivElement, tiles: any[], fgtiles: any[], duration: number, tiledata: any) {
    let domtiles = document.createElement("div");
    domtiles.classList.add("tileContainer");

    let fgdomtiles = document.createElement("div");
    fgdomtiles.classList.add("fgtiles");
    domtiles.appendChild(fgdomtiles);

    for (let row of tiles) {
        let domrow = document.createElement("div")
        domrow.classList.add("worldRow");
        for (let t of row) {
            let tile = createTile(t, tiledata);
            domrow.appendChild(tile);
        }
        domtiles.appendChild(domrow);
    }
    world.appendChild(domtiles);

    for (let t of fgtiles) {
        let code = t[0]
        let coords = t[1]
        let tile = createTile(code, tiledata);
        tile.style.setProperty(`top`, `calc(var(--tile) * ${coords[0]})`);
        tile.style.setProperty(`left`, `calc(var(--tile) * ${coords[1]})`);
        fgdomtiles.appendChild(tile);
    }

    animate(duration, (t: number) => t, (progress: number) => {
        domtiles.style.opacity = progress.toString();
    });
}

function setPos(world: HTMLDivElement, pos: any[] | number[]) {
    world.style.setProperty(
        "--y",
        `calc(${-pos[0]} * var(--size) / var(--proportion))`
    );
    world.style.setProperty(
        "--x",
        `calc(${-pos[1]} * var(--size) / var(--proportion))`
    );
}

async function keydown(world: HTMLDivElement, pressed: any[], pos: any[] | number[]) {
    while (pressed.length) {
        // screenlog(pressed);
        let ydif = 0;
        let xdif = 0;
        switch (pressed[0]) {
            case "w":
            case "ArrowUp":
                ydif = -1;
                break;
            case "s":
            case "ArrowDown":
                ydif = 1;
                break;
            case "a":
            case "ArrowLeft":
                xdif = -1;
                break;
            case "d":
            case "ArrowRight":
                xdif = 1;
                break;
            default:
                return;
        }
        let oldpos = pos.slice();
        await animawait(180, (t: any) => t, (progress: number) => {
            let newpos = [oldpos[0] + ydif * progress, oldpos[1] + xdif * progress];
            setPos(world, newpos);
        });
        pos[0] += ydif;
        pos[1] += xdif;
    }
};

function otheractions(key: string) {
    switch (key) {
        case " ":
        case "Enter":
            animate(300, (t: number) => Math.abs(t * (t - 0.5) * (t - 1) * 3), (progress: number) => {
                for (let chikin of document.getElementsByClassName("chikin") as HTMLCollectionOf < HTMLElement > ) {
                    chikin.style.setProperty("transform", `translateY(calc(${-progress} * var(--tile)))`);
                }
            });
            break;
    }
}


async function gameload(meta: metadata, tiletxt: string) {
    // Deal with tile info
    let datacodes = getTileData(meta);
    let tiledata = datacodes.data;
    let tilecodes = datacodes.codes;
    // screenlog(["tiledata:", tiledata]);
    let tilesandpos = parseTileTxt(tiletxt, tilecodes, meta.characters.chikin.code);
    let tiles = tilesandpos[0];
    let fgtiles = tilesandpos[1];
    let pos = tilesandpos[2];

    // Set up game area
    updateSize();
    window.addEventListener("resize", updateSize);

    let area = document.getElementById("game");
    if (area === null) {
        throw "No game area";
    }
    let world = document.createElement("div");
    world.classList.add("world");
    area.innerHTML = "";
    area.appendChild(world);

    // Place chikin
    setPos(world, pos);
    let chikinImg = new Image();
    chikinImg.src = meta.characters.chikin.img;
    chikinImg.classList.add("chikin");
    chikinImg.alt = "chikin";
    area.appendChild(chikinImg);

    screenlog("Loaded game");
    // screenlog(["tiles:", tiles]);

    // Fade in things
    await animawait(500, (t: any) => t, (progress: number) => {
        chikinImg.style.opacity = progress.toString();
    });
    await animate(1000, (t: any) => t, (progress: number) => {
        world.style.opacity = progress.toString();
    });
    // Fade in world
    drawWorld(world, tiles, fgtiles, 1000, tiledata);
    screenlog("Done");

    // Keypress handlers
    let pressed: string[] = [];
    let running = false;
    let usedkeys = new Set(["w", "ArrowUp", "s", "ArrowDown", "a", "ArrowLeft", "d", "ArrowRight"]);
    window.onkeyup = (e) => {
        let i = pressed.indexOf(e.key);
        if (i >= 0) {
            pressed.splice(i, 1);
        }
    };
    window.onkeydown = async function(e) {
        console.log("\"" + e.key + "\"");
        otheractions(e.key);
        if (pressed.indexOf(e.key) === -1) {
            if (usedkeys.has(e.key))
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

export { gameload, sleep, screenlog }