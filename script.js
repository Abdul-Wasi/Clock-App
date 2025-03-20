document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        time: document.getElementById("time"),
        period: document.getElementById("period"),
        date: document.getElementById("date"),
        hourHand: document.querySelector(".hour-hand"),
        minuteHand: document.querySelector(".minute-hand"),
        secondHand: document.querySelector(".second-hand"),
        digitalClock: document.getElementById("digitalClock"),
        analogClock: document.getElementById("analogClock"),
        stopwatchTimer: document.getElementById("stopwatchTimer"),
        stopwatchDisplay: document.getElementById("stopwatchDisplay"),
        timerDisplay: document.getElementById("timerDisplay"),
        startStopwatch: document.getElementById("startStopwatch"),
        resetStopwatch: document.getElementById("resetStopwatch"),
        startTimer: document.getElementById("startTimer"),
        resetTimer: document.getElementById("resetTimer"),
        timerInput: document.getElementById("timerInput")
    };

    let is24Hour = false;
    let lastUpdate = 0;
    let stopwatchRunning = false;
    let stopwatchStartTime = 0;
    let stopwatchInterval;
    let timerRunning = false;
    let timerEndTime = 0;
    let timerInterval;

    // Roman Numerals
    const romanNumerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    const numbersDiv = document.querySelector(".numbers");
    const radius = 110;

    romanNumerals.forEach((num, i) => {
        const angle = (i - 3) * (Math.PI / 6);
        const x = Math.cos(angle) * radius + 125;
        const y = Math.sin(angle) * radius + 125;

        const span = document.createElement("span");
        span.className = "roman";
        span.textContent = num;
        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
        numbersDiv.appendChild(span);
    });

    // Clock Updates
    function updateClocks(timestamp) {
        if (timestamp - lastUpdate < 1000) {
            requestAnimationFrame(updateClocks);
            return;
        }
        lastUpdate = timestamp;

        const now = new Date();
        updateDigital(now);
        updateAnalog(now);
        requestAnimationFrame(updateClocks);
    }

    function updateDigital(now) {
        try {
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const seconds = now.getSeconds().toString().padStart(2, "0");

            if (is24Hour) {
                elements.time.textContent = `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`;
                elements.period.textContent = "";
            } else {
                const period = hours >= 12 ? "PM" : "AM";
                const displayHours = (hours % 12) || 12;
                elements.time.textContent = `${displayHours.toString().padStart(2, "0")}:${minutes}:${seconds}`;
                elements.period.textContent = period;
            }

            // Update Date
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            elements.date.textContent = now.toLocaleDateString(undefined, options);
        } catch (error) {
            console.error("Digital clock update failed:", error);
            elements.time.textContent = "Error";
        }
    }

    function updateAnalog(now) {
        try {
            const hours = now.getHours() % 12;
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            const hourDeg = (hours * 30) + (minutes * 0.5);
            const minuteDeg = (minutes * 6) + (seconds * 0.1);
            const secondDeg = seconds * 6;

            elements.hourHand.style.transform = `rotate(${hourDeg}deg)`;
            elements.minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
            elements.secondHand.style.transform = `rotate(${secondDeg}deg)`;
        } catch (error) {
            console.error("Analog clock update failed:", error);
        }
    }

    // Stopwatch
    function updateStopwatch() {
        const elapsed = Date.now() - stopwatchStartTime;
        const hours = Math.floor(elapsed / 3600000).toString().padStart(2, "0");
        const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, "0");
        const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, "0");
        elements.stopwatchDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    elements.startStopwatch.addEventListener("click", () => {
        if (!stopwatchRunning) {
            stopwatchStartTime = Date.now() - (stopwatchStartTime ? stopwatchStartTime : 0);
            stopwatchInterval = setInterval(updateStopwatch, 1000);
            stopwatchRunning = true;
            elements.startStopwatch.textContent = "Stop";
        } else {
            clearInterval(stopwatchInterval);
            stopwatchRunning = false;
            elements.startStopwatch.textContent = "Start";
        }
    });

    elements.resetStopwatch.addEventListener("click", () => {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        stopwatchStartTime = 0;
        elements.stopwatchDisplay.textContent = "00:00:00";
        elements.startStopwatch.textContent = "Start";
    });

    // Timer
    function updateTimer() {
        const remaining = timerEndTime - Date.now();
        if (remaining <= 0) {
            clearInterval(timerInterval);
            elements.timerDisplay.textContent = "00:00:00";
            timerRunning = false;
            alert("Timer finished!");
            return;
        }
        const hours = Math.floor(remaining / 3600000).toString().padStart(2, "0");
        const minutes = Math.floor((remaining % 3600000) / 60000).toString().padStart(2, "0");
        const seconds = Math.floor((remaining % 60000) / 1000).toString().padStart(2, "0");
        elements.timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    elements.startTimer.addEventListener("click", () => {
        if (!timerRunning) {
            const seconds = parseInt(elements.timerInput.value);
            if (isNaN(seconds) || seconds <= 0) {
                alert("Please enter a valid time!");
                return;
            }
            timerEndTime = Date.now() + seconds * 1000;
            timerInterval = setInterval(updateTimer, 1000);
            timerRunning = true;
            elements.startTimer.textContent = "Stop";
        } else {
            clearInterval(timerInterval);
            timerRunning = false;
            elements.startTimer.textContent = "Start";
        }
    });

    elements.resetTimer.addEventListener("click", () => {
        clearInterval(timerInterval);
        timerRunning = false;
        elements.timerDisplay.textContent = "00:00:00";
        elements.startTimer.textContent = "Start";
    });

    // Event Listeners
    document.getElementById("digitalBtn").addEventListener("click", () => {
        elements.digitalClock.classList.remove("hidden");
        elements.analogClock.classList.add("hidden");
        elements.stopwatchTimer.classList.add("hidden");
    });

    document.getElementById("analogBtn").addEventListener("click", () => {
        elements.digitalClock.classList.add("hidden");
        elements.analogClock.classList.remove("hidden");
        elements.stopwatchTimer.classList.add("hidden");
    });

    document.getElementById("themeToggle").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    document.getElementById("formatToggle").addEventListener("click", () => {
        is24Hour = !is24Hour;
        updateDigital(new Date());
    });

    document.getElementById("fullscreenBtn").addEventListener("click", () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Initial setup
    elements.digitalClock.classList.remove("hidden");
    requestAnimationFrame(updateClocks);
});