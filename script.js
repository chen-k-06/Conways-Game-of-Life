
const SIDE_LENGTH = 20;
const grid = document.querySelector('.grid');
let inGame = false;

// generate boxes
for (let row = 0; row < SIDE_LENGTH; row++) {
    for (let column = 0; column < SIDE_LENGTH; column++) {
        let box = document.createElement('div');
        box.className = 'box';
        box.dataset.row = row;
        box.dataset.col = column;
        box.classList.add("dead");
        grid.appendChild(box);
    }
}

// event listener for clicks
let boxes = document.querySelectorAll(".box");
boxes.forEach((box, index) => {
    let row = Math.floor(index / SIDE_LENGTH);
    let col = index % SIDE_LENGTH;
    console.log(`Row: ${row}, Col: ${col}`);
    document.querySelector(`[data-row="${row}"][data-col="${col}"]`).addEventListener("click", () => {
        if (inGame == false) { // don't register any clicks after 'Start' button has been pressed
            if (box.classList.contains("alive")) {
                box.classList.remove("alive");
                box.classList.add("dead");
            }
            else {
                box.classList.add("alive");
                box.classList.remove("dead");
            }
        }
    });
});

// main game logic
async function start_game() {
    if (inGame) return;
    inGame = true;
    let boxes = document.querySelectorAll(".box");
    let states = [];

    while (inGame) {
        boxes.forEach((box, index) => {
            const isAlive = box.classList.contains("alive");
            let liveNeighbors = count_neighbors(index);

            // Underpopulation
            // Any live cell with fewer than 2 live neighbors dies (becomes dead).                
            if (liveNeighbors < 2 && isAlive) {
                states.push({ box, living: false });
            }

            //Survival
            // Any live cell with 2 or 3 live neighbors stays alive.
            else if (liveNeighbors < 4 && isAlive) {
                states.push({ box, living: true });
            }

            //Overpopulation:
            // Any live cell with more than 3 live neighbors dies.
            else if (liveNeighbors > 3 && isAlive) {
                states.push({ box, living: false });
            }

            //Reproduction:
            // Any dead cell with exactly 3 live neighbors becomes alive.
            else if (liveNeighbors == 3 && !isAlive) {
                states.push({ box, living: true });
            }

            states.forEach(({ box, living }) => {
                if (living) {
                    revive(box);
                }
                else {
                    kill(box);
                }
            });

            let alive_boxes = document.querySelectorAll(".alive");
            if (alive_boxes.length === 0) {
                console.log("Game over: no cells alive");
                inGame = false;
            }
        });
        await sleep(100);
    }
}

// start button event listener
document.getElementById("start-button").addEventListener("click", () => {
    start_game();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        start_game()
    }
});

// help button event listener
document.getElementById("help-button").addEventListener("click", () => {
    let popup = document.getElementById("help-popup")
    popup.classList.remove("hidden")
});

document.getElementById("close-help").addEventListener("click", () => {
    let popup = document.getElementById("help-popup")
    popup.classList.add("hidden")
});


function count_neighbors(index) {
    /**
     * Counts the number of alive neighbors the box at index has
     *
     * @param {number} index - index of the box
 
     * @returns {number} The number of living neighbors box has, [0,8]
     */

    let row = Math.floor(index / SIDE_LENGTH);
    let col = index % SIDE_LENGTH;
    let alive_neighbors_count = 0;

    let above_box = null;
    if (row - 1 >= 0) {
        above_box = document.querySelector(`[data-row="${row - 1}"][data-col="${col}"]`)
        if (above_box.classList.contains("alive")) {
            alive_neighbors_count++;
        }
    }

    let top_right_box = null;
    if (row - 1 >= 0 && col + 1 < SIDE_LENGTH) {
        top_right_box = document.querySelector(`[data-row="${row - 1}"][data-col="${col + 1}"]`)
        if (top_right_box.classList.contains("alive")) {
            alive_neighbors_count++;
        }
    }

    let top_left_box = null;
    if (row - 1 >= 0 && col - 1 >= 0) {
        top_left_box = document.querySelector(`[data-row="${row - 1}"][data-col="${col - 1}"]`)
        if (top_left_box.classList.contains("alive")) {
            alive_neighbors_count++;
        }
    }

    let right_box = null;
    if (col + 1 < SIDE_LENGTH) {
        right_box = document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`)
        if (right_box.classList.contains("alive")) {
            alive_neighbors_count++;
        }
    }

    let left_box = null;
    if (col - 1 >= 0) {
        left_box = document.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`)
        if (left_box.classList.contains("alive")) {
            alive_neighbors_count++;
        }
    }

    let bottom_left_box = null;
    if (row + 1 < SIDE_LENGTH && col - 1 >= 0) {
        bottom_left_box = document.querySelector(`[data-row="${row + 1}"][data-col="${col - 1}"]`)
        if (bottom_left_box.classList.contains("alive")) {
            alive_neighbors_count++;
        }
    }

    let bottom_right_box = null;
    if (row + 1 < SIDE_LENGTH && col + 1 < SIDE_LENGTH) {
        bottom_right_box = document.querySelector(`[data-row="${row + 1}"][data-col="${col + 1}"]`)
        if (bottom_right_box.classList.contains("alive")) {
            alive_neighbors_count++;
        }
    }

    let below_box = null;
    if (row + 1 < SIDE_LENGTH) {
        below_box = document.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`)
        if (below_box.classList.contains("alive")) {
            alive_neighbors_count++;
        }
    }

    return alive_neighbors_count;
}

function revive(box) {
    if (box.classList.contains("dead")) {
        box.classList.remove("dead");
    }
    box.classList.add("alive");
}

function kill(box) {
    if (box.classList.contains("alive")) {
        box.classList.remove("alive");
    }
    box.classList.add("dead");
}

function sleep(ms) {
    /**
     * Sleeps for ms milliseconds
     */
    return (new Promise(resolve => setTimeout(resolve, ms)));
}