
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
let intervalID;
function start_game() {
    if (inGame) return;
    inGame = true;
    let boxes = document.querySelectorAll(".box");
    boxes.forEach((box, index) => {
        let live_neighbors_count = count_neighbors(index);

        // Underpopulation
        // Any live cell with fewer than 2 live neighbors dies (becomes dead).                
        if (live_neighbors_count < 2) {
            kill(box);
        }

        //Survival
        // Any live cell with 2 or 3 live neighbors stays alive.
        else if (live_neighbors_count < 4) {
            revive(box);
        }

        //Overpopulation:
        // Any live cell with more than 3 live neighbors dies.
        else if (live_neighbors_count > 3) {
            kill(box);
        }

        //Reproduction:
        // Any dead cell with exactly 3 live neighbors becomes alive.
        else if (live_neighbors_count == 3) {
            revive(box);
        }

        // sleep(1);
    });
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

function count_neighbors(index) {
    /**
     * Calls the API. Ranks all possible guesses based on expected information, taking possible answers
     * into account. 
     *
     * @param {no idea} box - a box to count neighbors of
     * @param {number} index - index of the box
 
     * @returns {number} The number of living neighbors box has 
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

// function sleep(seconds) {

// }