// Digital Clock Function
function updateDigitalClock() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById("time").textContent = `${hours}:${minutes}:${seconds}`;
}

// Update every second
setInterval(updateDigitalClock, 1000);
updateDigitalClock(); 

// Analog Clock Function
function updateAnalogClock() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    let hourDeg = (hours % 12) * 30 + minutes * 0.5;
    let minuteDeg = minutes * 6;
    let secondDeg = seconds * 6;

    document.querySelector('.hour-hand').style.transform = `translate(-50%, -90%) rotate(${hourDeg}deg)`;
    document.querySelector('.minute-hand').style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
    document.querySelector('.second-hand').style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
}

// Update every second
setInterval(updateAnalogClock, 1000);
updateAnalogClock(); 

// Toggle Between Digital and Analog
document.getElementById("digitalBtn").addEventListener("click", function() {
    document.getElementById("digitalClock").classList.remove("hidden");
    document.getElementById("analogClock").classList.add("hidden");
});

document.getElementById("analogBtn").addEventListener("click", function() {
    document.getElementById("digitalClock").classList.add("hidden");
    document.getElementById("analogClock").classList.remove("hidden");
});

// Toggle Dark Mode
document.getElementById("themeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});
