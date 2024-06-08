const movingText = document.getElementById('movingText');
const rotatingText = document.getElementById('rotatingText');
const randomImage = document.getElementById('randomImage');

// Rozmiary napisu
const textWidth = 100;
const textHeight = 50;
const rotatingTextWidth = 150;
const rotatingTextHeight = 50;

// Rozmiary obrazu
const imageWidth = 600;
const imageHeight = 600;

// Maksymalne pozycje
const maxXText = window.innerWidth - textWidth;
const maxYText = window.innerHeight - textHeight;
const maxXRotatingText = window.innerWidth - rotatingTextWidth;
const maxYRotatingText = window.innerHeight - rotatingTextHeight;
const maxXImage = window.innerWidth - imageWidth;
const maxYImage = window.innerHeight - imageHeight;

// Pozycje elementów
let xPos, yPos;
let rotatingXPos = Math.random() * maxXRotatingText;
let rotatingYPos = Math.random() * maxYRotatingText;
let imageX, imageY;

// Lista losowych komunikatów
const messages = [
    "Ciepły to pedał", "Ciepły to cwel", "Ciepły lubi w doope", "Ciepły to zwykła dziwka", "Ciepły robi lachę na okrągło",
    "Ciepły płacze jak nie połknie", "Ciepły daje za darmo", "Ciepły preferuje z dupy do japy", "Ciepły wali konia do góry nogami", "Ciepły sra jak chodzi"
];

// Funkcja sprawdzająca kolizję
function isCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(x2 > x1 + w1 || x2 + w2 < x1 || y2 > y1 + h1 || y2 + h2 < y1);
}

// Generowanie losowej pozycji
function getRandomPosition(maxX, maxY) {
    return {
        x: Math.random() * maxX,
        y: Math.random() * maxY
    };
}

// Generowanie pozycji bez kolizji
do {
    const textPos = getRandomPosition(maxXText, maxYText);
    xPos = textPos.x;
    yPos = textPos.y;

    const imagePos = getRandomPosition(maxXImage, maxYImage);
    imageX = imagePos.x;
    imageY = imagePos.y;
} while (isCollision(xPos, yPos, textWidth, textHeight, imageX, imageY, imageWidth, imageHeight));

// Ustawienie pozycji elementów
movingText.style.left = `${xPos}px`;
movingText.style.top = `${yPos}px`;

randomImage.style.left = `${imageX}px`;
randomImage.style.top = `${imageY}px`;

rotatingText.style.left = `${rotatingXPos}px`;
rotatingText.style.top = `${rotatingYPos}px`;

// Parametry ruchu
const speed = 2;
let xDirection = (Math.random() < 0.5 ? -1 : 1) * speed;
let yDirection = (Math.random() < 0.5 ? -1 : 1) * speed;

const rotatingSpeed = 1;
let angle = 0;

const words = ["Słabo rucham", "Mówią na mnie minutka", "Czasami dochodzę na sam widok"];
let changeTextInterval = 1000;

// Funkcja ruchu napisu
function moveText() {
    xPos += xDirection;
    yPos += yDirection;

    if (xPos < 0 || xPos > window.innerWidth - movingText.offsetWidth) {
        xDirection *= -1;
    }

    if (yPos < 0 || yPos > window.innerHeight - movingText.offsetHeight) {
        yDirection *= -1;
    }

    movingText.style.left = xPos + 'px';
    movingText.style.top = yPos + 'px';

    checkCollision();
    requestAnimationFrame(moveText);
}

// Zmiana tekstu
function changeText() {
    const randomIndex = Math.floor(Math.random() * words.length);
    movingText.textContent = words[randomIndex];
}

function moveString() {
    xPos += xDirection;
    yPos += yDirection;

    if (xPos < 0 || xPos > window.innerWidth - movingText.offsetWidth) {
        xDirection *= -1;
    }

    if (yPos < 0 || yPos > window.innerHeight - movingText.offsetHeight) {
        yDirection *= -1;
    }

    rotatingText.style.left = xPos + 'px';
    rotatingText.style.top = yPos + 'px';

    rotateText();
    requestAnimationFrame(moveText);
}

// Funkcja losująca losowy kolor w formacie RGB
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Funkcja aktualizująca kolor napisu
function updateTextColor() {
    const rotatingText = document.getElementById('rotatingText');
    rotatingText.style.color = getRandomColor(); // Ustaw losowy kolor
}

// Funkcja obrotu napisu
function rotateText() {
    angle += rotatingSpeed;
    rotatingText.style.transform = `rotate(${angle}deg)`;

    rotatingXPos += Math.random() < 0.5 ? -0.5 : 0.5;
    rotatingYPos += Math.random() < 0.5 ? -0.5 : 0.5;

    if (rotatingXPos < 0 || rotatingXPos > maxXRotatingText) {
        rotatingXPos = Math.random() * maxXRotatingText;
    }

    if (rotatingYPos < 0 || rotatingYPos > maxYRotatingText) {
        rotatingYPos = Math.random() * maxYRotatingText;
    }

    rotatingText.style.left = `${rotatingXPos}px`;
    rotatingText.style.top = `${rotatingYPos}px`;

    setInterval(() => {
        updateTextColor(); // Aktualizuj kolor napisu
    }, 50); // 50ms - szybkość obrotu

    requestAnimationFrame(rotateText);
}

let lastCollisionTime = 0; // Czas ostatniej kolizji

// Parametry fizyczne
const bounceFactor = 0.5; // Współczynnik odbicia
const imageShift = 10; // Przesunięcie zdjęcia po kolizji

// Parametry ruchu
let textVelocityX = (Math.random() < 0.5 ? -1 : 1) * speed;
let textVelocityY = (Math.random() < 0.5 ? -1 : 1) * speed;

let imageVelocityX = 0;
let imageVelocityY = 0;

// Funkcja sprawdzająca kolizję
function checkCollision() {
    const currentTime = new Date().getTime();
    const textRect = movingText.getBoundingClientRect();
    const imageRect = randomImage.getBoundingClientRect();

    if (isCollision(
        textRect.left, textRect.top, textRect.width, textRect.height,
        imageRect.left, imageRect.top, imageRect.width, imageRect.height
    )) {
        updatePosition();
        // Sprawdź, czy wystąpiła kolizja po upływie 1 sekundy od ostatniej kolizji
        if (currentTime - lastCollisionTime > 1000) {
            showToast();
            lastCollisionTime = currentTime; // Zaktualizuj czas ostatniej kolizji

            // Ustaw kierunek i prędkość odpychania napisu
            textVelocityX *= -bounceFactor;
            textVelocityY *= -bounceFactor;

            // Przesuń zdjęcie po kolizji
            const angle = Math.atan2(textVelocityY, textVelocityX); // Kąt odpychania
            const shiftX = Math.cos(angle) * imageShift;
            const shiftY = Math.sin(angle) * imageShift;
            imageVelocityX += shiftX;
            imageVelocityY += shiftY;
        }
    }
}

// Funkcja aktualizująca pozycję napisu i zdjęcia
// Funkcja aktualizująca pozycję napisu i zdjęcia
function updatePosition() {
    // Aktualizacja pozycji napisu
    xPos += textVelocityX;
    yPos += textVelocityY;

    // Sprawdzenie granic okna dla napisu
    if (xPos < 0 || xPos > maxXText) {
        textVelocityX *= -bounceFactor; // Odbicie od krawędzi
        xPos = Math.min(maxXText, Math.max(xPos, 0)); // Ustawienie w granicach okna
    }
    if (yPos < 0 || yPos > maxYText) {
        textVelocityY *= -bounceFactor; // Odbicie od krawędzi
        yPos = Math.min(maxYText, Math.max(yPos, 0)); // Ustawienie w granicach okna
    }

    // Aktualizacja pozycji zdjęcia
    imageX += imageVelocityX;
    imageY += imageVelocityY;

    // Sprawdzenie granic okna dla zdjęcia
    if (imageX < 0 || imageX > maxXImage) {
        imageVelocityX *= -bounceFactor; // Odbicie od krawędzi
        imageX = Math.min(maxXImage, Math.max(imageX, 0)); // Ustawienie w granicach okna
    }
    if (imageY < 0 || imageY > maxYImage) {
        imageVelocityY *= -bounceFactor; // Odbicie od krawędzi
        imageY = Math.min(maxYImage, Math.max(imageY, 0)); // Ustawienie w granicach okna
    }

    // Aktualizuj pozycję elementów
    movingText.style.left = xPos + 'px';
    movingText.style.top = yPos + 'px';
    randomImage.style.left = imageX + 'px';
    randomImage.style.top = imageY + 'px';
}

// Funkcja wyświetlająca Toastify
function showToast() {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    Toastify({
        text: randomMessage,
        duration: 3000,
        gravity: "bottom", // Wyswietlanie na dole
        position: "right", // Wyswietlanie po prawej
        backgroundColor: "#333",
        stopOnFocus: true // Stop on hover
    }).showToast();
}

// Rozpoczęcie animacji
moveText();
moveString();
setInterval(changeText, changeTextInterval);

// Inicjalizacja confetti-js
const confettiSettings = { target: 'confetti-canvas' };
const confetti = new ConfettiGenerator(confettiSettings);
confetti.render();
