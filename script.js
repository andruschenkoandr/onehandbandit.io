const symbols = ["clover", "lemon", "coin", "ruby", "ladybug", "bell", "star", "seven"];

const slotIds = [
    ["slot0", "slot1", "slot2"],
    ["slot3", "slot4", "slot5"],
    ["slot6", "slot7", "slot8"]
];

const stopTimes = [1000, 1400, 1800];

const lever = document.getElementById("lever");
const gameMessage = document.getElementById("gameMessage");
const attemptsElement = document.getElementById("attemptCount");
const playerNameElement = document.getElementById("playerName");

let attempts = 0;
let isSpinning = false;
let gameFinished = false;

const playerName = prompt("Введіть ім'я:");

if (playerName && playerName.trim() !== "") {
    playerNameElement.textContent = playerName.trim();
} else {
    playerNameElement.textContent = "Гравець";
}

     // створення 3 рандом символів
function generateColumn() {
    const shuffledSymbols = [...symbols];

    for (let index = shuffledSymbols.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));

        [shuffledSymbols[index], shuffledSymbols[randomIndex]] =
            [shuffledSymbols[randomIndex], shuffledSymbols[index]];
    }

    return shuffledSymbols.slice(0, 3);
}

     // створення зображення в слоті
function setSlotImage(slot, symbol) {
    const image = document.createElement("img");

    image.src = `images/${symbol}.png`;
    image.alt = symbol;

    slot.replaceChildren(image);
}

     // відображення символів
function displaySlots(columns) {
    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            const slot = document.getElementById(
                slotIds[columnIndex][rowIndex]
            );

            setSlotImage(
                slot,
                columns[columnIndex][rowIndex]
            );
        }
    }
}

     // анімація стовпців
function animateColumn(columnIndex) {
    const randomColumn = generateColumn();

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        const slot = document.getElementById(
            slotIds[columnIndex][rowIndex]
        );

        setSlotImage(slot, randomColumn[rowIndex]);

        slot.classList.add("spinning");
        slot.classList.remove("winner");
    }
}

     // перевірка на однакові символи в стовпці
function checkWin(columns) {
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        const firstSymbol = columns[0][rowIndex];

        if (
            firstSymbol === columns[1][rowIndex] &&
            firstSymbol === columns[2][rowIndex]
        ) {
            return rowIndex;
        }
    }

    return -1;
}

     // підсвітка для переможного рядку
function highlightWinner(rowIndex) {
    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
        const slot = document.getElementById(
            slotIds[columnIndex][rowIndex]
        );

        slot.classList.add("winner");
    }
}

     // завершення спроби
function finishGame(columns) {
    const winningRow = checkWin(columns);

    attempts++;
    attemptsElement.textContent = `${attempts} / 3`;

    if (winningRow !== -1) {
        highlightWinner(winningRow);

        gameMessage.textContent = "Вітання! Ви перемогли!";
        gameFinished = true;
    } else if (attempts >= 3) {
        gameMessage.textContent = "Гра закінчена. Пощастить наступного разу.";
        gameFinished = true;
    } else {
        gameMessage.textContent = "Виграшу нема, спробуйте знову.";
    }

    isSpinning = false;

    if (gameFinished) {
        lever.classList.add("disabled");
    } else {
        lever.classList.remove("disabled");
    }
}

     // спроба
function spin() {
    if (gameFinished || isSpinning) {
        return;
    }

    isSpinning = true;
    lever.classList.add("disabled");

    gameMessage.textContent = "Крутка...";

    const generatedColumns = [
        generateColumn(),
        generateColumn(),
        generateColumn()
    ];

    const animationIntervals = [];

     // окрема анімація для кожного стовпця
    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
        const interval = setInterval(() => {
            animateColumn(columnIndex);
        }, 100);

        animationIntervals.push(interval);
    }

     // зупинка анімація стовпців окремо
    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
        setTimeout(() => {
            clearInterval(animationIntervals[columnIndex]);

            for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
                const slot = document.getElementById(
                    slotIds[columnIndex][rowIndex]
                );

                setSlotImage(
                    slot,
                    generatedColumns[columnIndex][rowIndex]
                );

                slot.classList.remove("spinning");
            }
        }, stopTimes[columnIndex]);
    }

     // перевірки
    setTimeout(() => {
        finishGame(generatedColumns);
    }, stopTimes[2] + 100);
}

     // ричаг
function pullLever() {
    if (gameFinished || isSpinning) {
        return;
    }

    lever.classList.add("pulled");

    setTimeout(() => {
        lever.classList.remove("pulled");
    }, 500);

    spin();
}

lever.addEventListener("click", pullLever);

displaySlots([
    generateColumn(),
    generateColumn(),
    generateColumn()
]);