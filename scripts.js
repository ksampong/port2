 // Function to open a window (for Projects, Interests, About)
function openWindow(windowId) {
    document.getElementById(windowId).style.display = 'block';
}

// Function to close a window
function closeWindow(windowId) {
    document.getElementById(windowId).style.display = 'none';
}

// Dropdown functionality for Projects and Interests
document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('click', function() {
        const dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
        } else {
            dropdownContent.style.display = 'block';
        }
    });
});

// Book opening functionality
document.getElementById('book').addEventListener('click', function() {
    this.classList.add('opened');  // Add class to open the book
// Show the left page after the book is clicked
    const leftPage = document.querySelector('.book-left');
    leftPage.style.display = 'flex'; // Change from 'none' to 'flex' after the book is clicked
});
// Function to update the time in the status bar
function updateTime() {
    const timeElement = document.getElementById('statusBarTime');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
}

// Call updateTime every second to keep the time updated
setInterval(updateTime, 1000);

// Call it initially to set the time immediately on load
updateTime();

// Define the start-up sequence and your introduction text
const terminalText = `
Booting up system...
Checking memory... [OK]
Checking disk... [OK]
Loading Kofi's Journal... [OK]
System ready.

My name is Kofi. I am an aspiring engineer trying to learn and build up my skills and knowledge. This is a journal where I record my progress.
`;

// Function to simulate the typing effect
function typeText(text, speed, element) {
    let index = 0;

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed); // Control typing speed
        }
    }

    type();
}

// Start the typing animation when the page loads
window.onload = function() {
    const terminalOutput = document.getElementById('terminalOutput');
    typeText(terminalText, 50, terminalOutput); // Speed of typing: 50ms per character
};
