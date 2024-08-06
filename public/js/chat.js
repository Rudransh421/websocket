const socket = io();
let username = null;

// Function to prompt for the username and set it
function promptForUsername() {
    while (!username) {
        username = prompt("Enter your name");
    }
}

// Prompt for username initially
promptForUsername();

// Handle form submission
document.getElementById('send-container').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const input = document.getElementById('msgin');
    const fileInput = document.getElementById('fileInput');
    const msg = input.value.trim();
    const file = fileInput.files[0];
    
    if (msg || file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                socket.emit('chat message', { text: msg, username: username, image: e.target.result });
            };
            reader.readAsDataURL(file);
            fileInput.value = ''; // Clear the file input
        } else {
            socket.emit('chat message', { text: msg, username: username });
        }
        input.value = '';
    }
});

// Receive messages from the server
socket.on('chat message', function(data) {
    const container = document.querySelector('.container');
    const div = document.createElement('div');
    div.className = 'msg';
    div.classList.add(data.username === username ? 'right' : 'left'); // Align message
    if (data.text) {
        div.innerHTML = `<strong>${data.username}:</strong> ${data.text}`;
    }
    if (data.image) {
        const img = document.createElement('img');
        img.src = data.image;
        img.style.maxWidth = '300px'; // Limit image width
        img.style.borderRadius = '10px'; // Optional styling
        div.appendChild(img);
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight; // Scroll to the bottom
});

// Receive system messages
socket.on('system message', function(message) {
    const container = document.querySelector('.container');
    const div = document.createElement('div');
    div.className = 'msg system';
    div.textContent = message;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight; // Scroll to the bottom
});
