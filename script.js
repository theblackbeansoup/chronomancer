document.addEventListener('DOMContentLoaded', function() {
    const addCharacterButton = document.getElementById('add-character');
    const statsContainer = document.getElementById('stats-container');
    const setTimeButton = document.getElementById('set-timer');
    const timeInput = document.getElementById('time-input');
    const timerDisplay = document.getElementById('timer');
    const startPauseButton = document.getElementById('start-pause');
    let timer = null;
    let countdownTime = 0;
    let isRunning = false;
    let characterId = 1;

    // Sanitize content to prevent HTML injection
    function sanitizeContent(text) {
        const tempElement = document.createElement('div');
        tempElement.textContent = text;
        return tempElement.innerHTML;
    }

    // Function to handle character addition
    function addCharacter(name) {
        const characterElement = document.createElement('div');
        characterElement.classList.add('character');
        characterElement.innerHTML = `
            <span class="remove-character">X</span>
            <div class="character-name" contenteditable="true">${sanitizeContent(name).substring(0, 40)}</div>
            <div class="counter" data-type="hp">
                <button class="decrease">-</button>
                <span class="value">20</span>
                <button class="increase">+</button>
                HP
            </div>
            <div class="counter" data-type="mana">
                <button class="decrease">-</button>
                <span class="value">10</span>
                <button class="increase">+</button>
                Mana
            </div>
        `;
        statsContainer.appendChild(characterElement);

        // Prevent HTML paste and enforce character limit
        const characterName = characterElement.querySelector('.character-name');
        characterName.addEventListener('paste', function(e) {
            e.preventDefault();
            let text = (e.clipboardData || window.clipboardData).getData('text');
            text = sanitizeContent(text).substring(0, 40); // Limit text to 40 characters
            document.execCommand('insertText', false, text);
        });

        // Enforce character limit as user types
        characterName.addEventListener('input', function() {
            if (this.textContent.length > 40) {
                this.textContent = this.textContent.substring(0, 40);
            }
        });

        characterElement.querySelector('.remove-character').addEventListener('click', () => {
            statsContainer.removeChild(characterElement);
        });

        characterElement.querySelectorAll('.increase, .decrease').forEach(button => {
            button.addEventListener('click', function() {
                const counter = this.parentElement.querySelector('.value');
                let newValue = this.classList.contains('increase') ? parseInt(counter.textContent) + 1 : Math.max(0, parseInt(counter.textContent) - 1);
                counter.textContent = newValue;

                if (counter.parentElement.getAttribute('data-type') === 'hp') {
                    characterElement.style.backgroundColor = newValue <= 0 ? 'red' : '';
                    characterElement.style.color = newValue <= 0 ? 'white' : '';
                }
            });
        });
    }

    addCharacterButton.addEventListener('click', () => addCharacter(`Character ${characterId++}`));

    setTimeButton.addEventListener('click', () => {
        countdownTime = Math.max(0, parseInt(timeInput.value, 10) || 0);
        updateDisplay();
        clearInterval(timer);
        timer = null;
        isRunning = false;
        startPauseButton.textContent = "Start";
    });

    startPauseButton.addEventListener('click', () => {
        if (!isRunning) {
            timer = setInterval(() => {
                countdownTime--;
                updateDisplay();
                if (countdownTime <= 0) {
                    clearInterval(timer);
                    timer = null;
                    isRunning = false;
                    startPauseButton.textContent = "Start";
                }
            }, 1000);
            startPauseButton.textContent = "Pause";
            isRunning = true;
        } else {
            clearInterval(timer);
            timer = null;
            startPauseButton.textContent = "Start";
            isRunning = false;
        }
    });

    function updateDisplay() {
        const minutes = Math.floor(countdownTime / 60);
        const seconds = countdownTime % 60;
        timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}`;
        timerDisplay.style.color = countdownTime <= 0 ? 'red' : '';
    }

    function pad(value) {
        return value.toString().padStart(2, '0');
    }
});
