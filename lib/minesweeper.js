const table = document.getElementById("minesweeper");
let rows = null;
let gridSize = 10;
let mines = 15;
let bombCoords = [];
const randomCoord = () => Math.floor(Math.random() * rows.length);

let bombArray = null;

const drawGrid = (() => {
  table.innerHTML = "";
  for (let i = 0; i < gridSize; i += 1) {
    table.insertAdjacentHTML("beforeend", "<tr></tr>");
    for (let y = 0; y < gridSize; y += 1) {
      table.querySelectorAll("tr")[i].insertAdjacentHTML("afterbegin", "<td class='unopened'></td>");
    }
  }
  rows = table.querySelectorAll("tr");
});

const setBombs = () => {
  for (let i = 0; i < mines; i += 1) {
    const cell = rows[randomCoord()].querySelectorAll("td")[randomCoord()];
    if (cell.dataset.bomb) {
      i -= 1;
    } else {
      cell.dataset.bomb = false;
    }
  }
  bombArray = document.querySelectorAll('[data-bomb]');
};

const gameOver = () => {
  window.alert("Boom!");
  reset();
};

const checkForWin = () => {
  const squaresRemaining = document.querySelectorAll(".unopened").length;
  if (squaresRemaining === mines) {
    window.alert("Winner winner, chicken dinner");
    face.innerHTML = "&#128526";
  }
};

const checkAround = ((cell) => {
  const cIndex = cell.cellIndex;
  const rIndex = cell.parentElement.rowIndex;
  let count = 0;
  bombCoords.forEach((coord) => {
    if ((coord[0] - cIndex) >= -1
        && (coord[0] - cIndex) <= 1
        && (coord[1] - rIndex) >= -1
        && (coord[1] - rIndex) <= 1) {
      count += 1;
    }
  });
  return count;
});

const autoClearLeft = ((cIndex, rIndex) => {
  console.log(cIndex);
  const targetCell = rows[rIndex].querySelectorAll("td")[cIndex - 1] || null;
  if (targetCell !== null && !targetCell.hasAttribute("data-bomb") && targetCell.classList.contains("unopened")) {
    targetCell.classList.add("opened");
    targetCell.classList.remove("unopened");
    if (checkAround(targetCell) === 0) {
      autoClear(targetCell);
    } else {
      targetCell.classList.add(`mine-neighbour-${checkAround(targetCell)}`);
    }
  }
});

const autoClearRight = ((cIndex, rIndex) => {
  const targetCell = rows[rIndex].querySelectorAll("td")[cIndex + 1] || null;
  if (targetCell !== null && !targetCell.hasAttribute("data-bomb") && targetCell.classList.contains("unopened")) {
    targetCell.classList.add("opened");
    targetCell.classList.remove("unopened");
    if (checkAround(targetCell) === 0) {
      autoClear(targetCell);
    } else {
      targetCell.classList.add(`mine-neighbour-${checkAround(targetCell)}`);
    }
  }
});

const autoClearUp = ((cIndex, rIndex) => {
  let targetCell = null;
  if (rows[rIndex - 1] !== undefined) {
    targetCell = rows[rIndex - 1].querySelectorAll("td")[cIndex];
  }
  if (targetCell !== null && !targetCell.hasAttribute("data-bomb") && targetCell.classList.contains("unopened")) {
    targetCell.classList.add("opened");
    targetCell.classList.remove("unopened");
    if (checkAround(targetCell) === 0) {
      autoClear(targetCell);
    } else {
      targetCell.classList.add(`mine-neighbour-${checkAround(targetCell)}`);
    }
  }
});

const autoClearDown = ((cIndex, rIndex) => {
  let targetCell = null;
  if (rows[rIndex + 1] !== undefined) {
    targetCell = rows[rIndex + 1].querySelectorAll("td")[cIndex];
  }
  if (targetCell !== null && !targetCell.hasAttribute("data-bomb") && targetCell.classList.contains("unopened")) {
    targetCell.classList.add("opened");
    targetCell.classList.remove("unopened");
    if (checkAround(targetCell) === 0) {
      autoClear(targetCell);
    } else {
      targetCell.classList.add(`mine-neighbour-${checkAround(targetCell)}`);
    }
  }
});

const autoClear = ((cell) => {
  const cIndex = cell.cellIndex;
  const rIndex = cell.parentElement.rowIndex;
  autoClearDown(cIndex, rIndex);
  autoClearUp(cIndex, rIndex);
  autoClearLeft(cIndex, rIndex);
  autoClearRight(cIndex, rIndex);
});

const leftClickListen = ((cells) => {
  cells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
      if (event.currentTarget.dataset.bomb) {
        event.currentTarget.classList.add("mine");
        gameOver();
      } else {
        event.currentTarget.classList.add("opened");
        event.currentTarget.classList.remove("unopened");
        if (checkAround(event.currentTarget) === 0) {
          autoClear(event.currentTarget);
        }
        event.currentTarget.classList.add(`mine-neighbour-${checkAround(event.currentTarget)}`);
      }
      console.log(checkAround(event.currentTarget));
      checkForWin();
    });
  });
});

const rightClickListen = ((cells) => {
  cells.forEach((cell) => {
    cell.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (cell.classList.contains("unopened")) {
        cell.classList.toggle("flagged");
      }
    });
  });
});

const minesDown = document.querySelector(".mine-down");
minesDown.addEventListener("click", (event) => {
  event.preventDefault();
  if (mines > 1) {
    mines -= 1;
    reset();
  }
});
const minesUp = document.querySelector(".mine-up");
minesUp.addEventListener("click", (event) => {
  event.preventDefault();
  if (mines < gridSize * gridSize - gridSize) {
    mines += 1;
    reset();
  }
});
const gridDown = document.querySelector(".size-down");
gridDown.addEventListener("click", (event) => {
  event.preventDefault();
  if (gridSize > 5) {
    gridSize -= 1;
    reset();
  }
});
const gridUp = document.querySelector(".size-up");
gridUp.addEventListener("click", (event) => {
  event.preventDefault();
  if (gridSize < 20) {
    gridSize += 1;
    reset();
  }
});
const face = document.querySelector(".face");
face.addEventListener("click", () => {
  reset();
});

const reset = (() => {
  drawGrid();
  setBombs();
  const cells = document.querySelectorAll("td");
  leftClickListen(cells);
  rightClickListen(cells);
  bombCoords = [];
  bombArray.forEach((bomb) => {
    bombCoords.push([bomb.cellIndex, bomb.parentElement.rowIndex]);
  });
  document.getElementById("bomb-count").innerText = `${mines} Bombs`;
  document.querySelector(".frame").style.width = `${gridSize * 24 + 48}px`;
  face.innerHTML = "&#128512";
});

document.addEventListener("DOMContentLoaded", (event) => {
  reset();
});
