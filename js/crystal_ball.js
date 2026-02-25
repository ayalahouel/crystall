
const chatHistoryElement = document.getElementById('chat-history');
const userInputElement = document.getElementById('user-input');
const askButton = document.getElementById('ask-button');
const loadingIndicator = document.getElementById('loading-indicator');
const customMessageBox = document.getElementById('custom-message-box');
const modelSelectElement = document.getElementById('model-select');


let chatHistory = [
    { 
        role: "system", 
        content: `You are a mystical crystal ball in a fantasy RPG world. Respond to all queries with magical, 
        medieval-appropriate language. Refer to yourself as "the Orb" or "the Crystal". Use archaic terms and 
        fantasy metaphors. Never break character. Format responses as if glowing text appears in the sphere.`
    }
];

const API_KEY = "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";
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'


const RPG_MODELS = [
    { id: "mistralai/mistral-7b-instruct", name: "Mystic's Orb (Mistral)" },
    { id: "gryphe/mythomax-l2-13b", name: "Archmage's Sphere (MythoMax)" },
    { id: "anthropic/claude-instant-v1", name: "Enchanted Prism (Claude)" }
];


document.addEventListener('DOMContentLoaded', () => {
    initializeModelSelect();
    addMessageToChat("The crystal ball shimmers to life, awaiting your query, brave adventurer...", 'system');
    
    askButton.addEventListener('click', sendMessage);
    userInputElement.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
});



function initializeModelSelect() {
    RPG_MODELS.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.name;
        modelSelectElement.appendChild(option);
    });
}

function addMessageToChat(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const senderLabel = document.createElement('div');
    senderLabel.classList.add('sender-label');
    senderLabel.textContent = 
        sender === 'user' ? 'You' : 
        sender === 'system' ? '✦ The Ancient Orb ✦' : 
        '✦ The Crystal Ball ✦';
    
    const p = document.createElement('p');
    p.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<span class="glowing-text">$1</span>');
    
    messageDiv.appendChild(senderLabel);
    messageDiv.appendChild(p);
    chatHistoryElement.appendChild(messageDiv);
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
}

function showMessageBox(message, duration = 3000) {
    customMessageBox.innerHTML = `✨ ${message} ✨`;
    customMessageBox.style.display = 'block';
    setTimeout(() => customMessageBox.style.display = 'none', duration);
}


async function sendMessage() {
    const userMessage = userInputElement.value.trim();
    if (!userMessage) {
        showMessageBox("The Orb requires words to peer beyond the veil...");
        return;
    }

    
    addMessageToChat(userMessage, 'user');
    chatHistory.push({ role: "user", content: userMessage });
    userInputElement.value = '';

    
    askButton.innerHTML = '<i class="crystal-spin">⌛</i> Consulting the Spirits...';
    loadingIndicator.classList.remove('hidden');
    userInputElement.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Mystic Orb App',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelSelectElement.value,
                messages: chatHistory,
                temperature: 0.8, 
                max_tokens: 350
            })
        });

        if (!response.ok) throw new Error("The arcane energies falter...");

        const result = await response.json();
        let botResponse = result.choices[0]?.message?.content || 
                        "The mists swirl but reveal nothing...";

        
        botResponse = enhanceFantasyResponse(botResponse);
        
        addMessageToChat(botResponse, 'bot');
        chatHistory.push({ role: "assistant", content: botResponse });

    } catch (error) {
        const errorMessages = [
            "The crystal darkens as the connection to the spirit realm falters...",
            "A crack forms in the Orb's surface as the magic fails!",
            "The visions are obscured by an unknown mystical interference..."
        ];
        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        addMessageToChat(randomError, 'bot');
    } finally {
        askButton.innerHTML = 'Consult the Orb';
        loadingIndicator.classList.add('hidden');
        userInputElement.disabled = false;
        userInputElement.focus();
    }
}

function enhanceFantasyResponse(text) {
    
    const prefixes = [
        "The Orb shimmers and reveals:",
        "As the mists part, you see:",
        "A voice echoes from the crystal:",
        "Runes glow within the sphere:"
    ];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    
    return prefix + " " + text
        .replace(/hello/gi, "Hail")
        .replace(/yes/gi, "Aye")
        .replace(/no/gi, "Nay")
        .replace(/maybe/gi, "The omens are unclear")
        .replace(/I think/gi, "The spirits whisper")
        .replace(/you should/gi, "The ancient ones decree")
        .replace(/thank you/gi, "My gratitude, wise one")
        .replace(/\bgood\b/gi, "auspicious")
        .replace(/\bbad\b/gi, "ill-omened");
}


function clearChat() {
    chatHistory = [
        { 
            role: "system", 
            content: `Continue roleplaying as a mystical crystal ball in a fantasy world. 
            Use archaic language and fantasy metaphors.` 
        }
    ];
    chatHistoryElement.innerHTML = '';
    addMessageToChat("The Orb's surface clears, ready for new divinations...", 'system');
}
