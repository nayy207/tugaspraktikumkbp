// Pomodoro Timer Functionality
let pomodoroDuration = localStorage.getItem("pomodoroDuration") ? parseInt(localStorage.getItem("pomodoroDuration")) : 25 * 60;
let breakDuration = localStorage.getItem("breakDuration") ? parseInt(localStorage.getItem("breakDuration")) : 5 * 60;
let timeLeft = localStorage.getItem("timeLeft") ? parseInt(localStorage.getItem("timeLeft")) : pomodoroDuration;
let isBreakTime = localStorage.getItem("isBreakTime") === "true";
let isTimerRunning = localStorage.getItem("isTimerRunning") === "true";  // track if the timer was running
let timerInterval;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function saveState() {
    console.log('Saving state...');
    localStorage.setItem("pomodoroDuration", pomodoroDuration);
    localStorage.setItem("breakDuration", breakDuration);
    localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("isBreakTime", isBreakTime);
    localStorage.setItem("isTimerRunning", isTimerRunning); // Save timer running state
    console.log('State saved:', {
        pomodoroDuration, breakDuration, timeLeft, isBreakTime, isTimerRunning
    });
}

function startTimer() {
    if (isTimerRunning) return; // Prevent multiple timers
    isTimerRunning = true;
    saveState(); // Save state when timer starts
    console.log('Starting timer...');

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        saveState();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            console.log('Timer completed. Switching to break.');

            if (!isBreakTime) {
                alert("Break time! Take a rest.");
                timeLeft = breakDuration;
                isBreakTime = true;
            } else {
                alert("Break is over! Back to work.");
                timeLeft = pomodoroDuration;
                isBreakTime = false;
            }
            saveState();
            startTimer(); // Automatically start next timer after break
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    isBreakTime = false;
    timeLeft = pomodoroDuration;
    saveState();
    updateTimerDisplay();
    console.log('Timer reset');
}

function saveDurations() {
    const workInput = document.getElementById("pomodoro-duration").value;
    const breakInput = document.getElementById("break-duration").value;

    const workMinutes = parseInt(workInput, 10);
    const breakMinutes = parseInt(breakInput, 10);

    if (!isNaN(workMinutes) && workMinutes > 0) {
        pomodoroDuration = workMinutes * 60;
        timeLeft = pomodoroDuration;
    }

    if (!isNaN(breakMinutes) && breakMinutes > 0) {
        breakDuration = breakMinutes * 60;
    }

    saveState();
    updateTimerDisplay();
    alert("Durations have been saved!");
}

// To-Do List Functionality
const todoInput = document.getElementById("todo-input");
const addTaskButton = document.getElementById("add-task-button");
const todoList = document.getElementById("todo-list");

function loadTodoList() {
    const storedTasks = JSON.parse(localStorage.getItem("todoList")) || [];
    storedTasks.forEach(createTask);
    console.log('Todo list loaded:', storedTasks);
}

function saveTodoList() {
    const tasks = Array.from(todoList.children).map(item => ({
        text: item.querySelector("span").textContent,
        completed: item.querySelector("input[type=checkbox]").checked
    }));
    localStorage.setItem("todoList", JSON.stringify(tasks));
    console.log('Todo list saved:', tasks);
}

function createTask({ text, completed }) {
    const listItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", saveTodoList);
    listItem.appendChild(checkbox);

    const taskContent = document.createElement("span");
    taskContent.textContent = text;
    taskContent.style.margin = "0 10px";
    taskContent.style.textDecoration = completed ? "line-through" : "none";
    listItem.appendChild(taskContent);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.style.margin = "0 5px";
    editButton.addEventListener("click", () => {
        const newTaskText = prompt("Edit your task:", taskContent.textContent);
        if (newTaskText) {
            taskContent.textContent = newTaskText.trim();
            saveTodoList();
        }
    });
    listItem.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        listItem.remove();
        saveTodoList();
    });
    listItem.appendChild(deleteButton);

    todoList.appendChild(listItem);
}

function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    createTask({ text: taskText, completed: false });
    saveTodoList();
    todoInput.value = "";
}

addTaskButton.addEventListener("click", addTask);
todoInput.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Spotify Functionality
const playlistId = localStorage.getItem("playlistId") || "0xOz7fGuXhzVIVZmDmpqdt";

function saveSpotifyPlaylist(id) {
    localStorage.setItem("playlistId", id);
}

function createSpotifyEmbed(id) {
    const spotifyEmbedContainer = document.getElementById("spotify-embed-container");
    spotifyEmbedContainer.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.title = "Spotify Embed: Recommendation Playlist";
    iframe.src = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
    iframe.width = "100%";
    iframe.height = "360";
    iframe.style.borderRadius = "12px";
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.loading = "lazy";

    spotifyEmbedContainer.appendChild(iframe);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('Page loaded, checking timer state...');
    // Ensure timer starts from saved state
    if (isTimerRunning) {
        startTimer(); // start the timer if it's running
    } else {
        updateTimerDisplay();
    }
    loadTodoList();
    createSpotifyEmbed(playlistId);
});

// Event Listeners for Pomodoro Timer
document.getElementById("start-button").addEventListener("click", startTimer);
document.getElementById("reset-button").addEventListener("click", resetTimer);
document.getElementById("save-button").addEventListener("click", saveDurations);
