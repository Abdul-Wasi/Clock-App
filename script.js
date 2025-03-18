document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        time: document.getElementById("time"),
        period: document.getElementById("period"),
        hourHand: document.querySelector(".hour-hand"),
        minuteHand: document.querySelector(".minute-hand"),
        secondHand: document.querySelector(".second-hand"),
        digitalClock: document.getElementById("digitalClock"),
        analogClock: document.getElementById("analogClock")
    };

    let is24Hour = false;
    let lastUpdate = 0;

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
        } catch (error) {
            console.error("Digital clock update failed:", error);
            elements.time.textContent = "Error";
        }
    }

    function updateAnalog(now) {
        try {
            // Calculate degrees for each hand
            const hours = now.getHours() % 12;
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            // Hour hand: 360°/12 hours = 30° per hour + 0.5° per minute
            const hourDeg = (hours * 30) + (minutes * 0.5);
            // Minute hand: 360°/60 minutes = 6° per minute + 0.1° per second
            const minuteDeg = (minutes * 6) + (seconds * 0.1);
            // Second hand: 360°/60 seconds = 6° per second
            const secondDeg = seconds * 6;

            elements.hourHand.style.transform = `rotate(${hourDeg}deg)`;
            elements.minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
            elements.secondHand.style.transform = `rotate(${secondDeg}deg)`;
        } catch (error) {
            console.error("Analog clock update failed:", error);
        }
    }

    // Event Listeners
    document.getElementById("digitalBtn").addEventListener("click", () => {
        elements.digitalClock.classList.remove("hidden");
        elements.analogClock.classList.add("hidden");
    });

    document.getElementById("analogBtn").addEventListener("click", () => {
        elements.digitalClock.classList.add("hidden");
        elements.analogClock.classList.remove("hidden");
    });

    document.getElementById("themeToggle").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    document.getElementById("formatToggle").addEventListener("click", () => {
        is24Hour = !is24Hour;
        updateDigital(new Date());
    });

    // Initial setup
    elements.digitalClock.classList.remove("hidden");
    requestAnimationFrame(updateClocks);
});