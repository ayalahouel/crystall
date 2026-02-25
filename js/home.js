
const oracles = [
    "✨ “The stars favor bold choices.”",
    "🌙 “A shadow today may reveal a light tomorrow.”",
    "🪄 “Trust the silent breeze — it speaks louder than thunder.”",
    "🔥 “From ashes rise embers of rebirth.”"
];
document.getElementById("oracle-text").innerText =
    oracles[Math.floor(Math.random() * oracles.length)];
