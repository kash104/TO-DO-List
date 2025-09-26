// --- DOM Elements ---
const taskInput = document.getElementById('newTaskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const progressBarFill = document.getElementById('progressBarFill');
const progressText = document.getElementById('progressText');
const taskDetailsModal = document.getElementById('taskDetailsModal');
const taskDetailsCloseButton = taskDetailsModal.querySelector('.close-button');
const modalTaskTitle = document.getElementById('modalTaskTitle');
const modalTaskStatus = document.getElementById('modalTaskStatus');
const toggleTaskStatusButton = document.getElementById('toggleTaskStatusButton');

// Pomodoro Timer Elements
const timerDisplay = document.getElementById('timerDisplay');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');

// Quote Modal Elements
const getQuoteButton = document.getElementById('getQuoteButton');
const quoteModal = document.getElementById('quoteModal');
const quoteCloseButton = quoteModal.querySelector('.close-button');
const quoteText = document.getElementById('quoteText');
const quoteCloseOkayButton = document.getElementById('quoteCloseOkay');
const quoteCloseGreatButton = document.getElementById('quoteCloseGreat');

// --- Data Arrays ---
let tasks = [];
const quotes = [
    "The secret of getting ahead is getting started.",
    "Don’t watch the clock; do what it does. Keep going.",
    "The best way to predict the future is to create it.",
    "You are never too old to set another goal or to dream a new dream.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
    "The only way to do great work is to love what you do."
];

// --- Pomodoro Timer Variables ---
let timer = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let intervalId;

// --- Core Functions ---

/**
 * Renders the main task list to the DOM.
 */
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const listItem = createListItem(task, index);
        taskList.appendChild(listItem);
    });
    updateProgress(tasks, progressBarFill, progressText);
}

/**
 * Creates a single list item element for a task.
 * @param {Object} task - The task object.
 * @param {number} index - The index of the task.
 */
function createListItem(task, index) {
    const listItem = document.createElement('li');
    listItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
        tasks[index].completed = checkbox.checked;
        updateProgress(tasks, progressBarFill, progressText);
        const item = document.querySelectorAll('.task-item')[index];
        if (item) {
            item.classList.toggle('completed', tasks[index].completed);
        }
    });

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    taskText.addEventListener('click', () => {
        openModal(task);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'X';
    deleteBtn.title = 'Delete Task';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        listItem.classList.add('fade-out');
        listItem.addEventListener('transitionend', () => {
            tasks.splice(index, 1);
            renderTasks();
        }, { once: true });
    });

    taskContent.appendChild(checkbox);
    taskContent.appendChild(taskText);
    listItem.appendChild(taskContent);
    listItem.appendChild(deleteBtn);

    return listItem;
}

/**
 * Updates the progress bar and text for a given list.
 */
function updateProgress(list, progressBar, progressTextElement) {
    const totalTasks = list.length;
    const completedTasks = list.filter(t => t.completed).length;
    const progressPercent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressTextElement.textContent = `${completedTasks}/${totalTasks} tasks completed`;
}

/**
 * Adds a new task to the main list.
 */
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        renderTasks();
    }
}

/**
 * Opens the task details pop-up.
 */
function openModal(task) {
    modalTaskTitle.textContent = task.text;
    modalTaskStatus.textContent = `Status: ${task.completed ? 'Completed' : 'Pending'}`;
    toggleTaskStatusButton.textContent = task.completed ? 'Mark as Pending' : 'Mark as Complete';
    
    // This button now only closes the modal
    toggleTaskStatusButton.onclick = () => {
        task.completed = !task.completed;
        renderTasks();
        closeModal(taskDetailsModal);
    };
    
    taskDetailsModal.style.display = 'block';
    setTimeout(() => taskDetailsModal.classList.add('is-visible'), 10);
}

/**
 * Closes a given modal.
 */
function closeModal(modalElement) {
    modalElement.classList.remove('is-visible');
    setTimeout(() => {
        modalElement.style.display = 'none';
    }, 300); // Wait for the transition to finish
}

/**
 * Displays a random quote in the quote modal.
 */
function displayQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[randomIndex];
    quoteModal.style.display = 'block';
    setTimeout(() => quoteModal.classList.add('is-visible'), 10);
}

// --- Pomodoro Timer Functions ---

/**
 * Updates the timer display every second.
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (timer <= 0) {
        pauseTimer();
        timerDisplay.textContent = "Time's up!";
    }
}

/**
 * Starts the timer.
 */
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        intervalId = setInterval(() => {
            if (timer > 0) {
                timer--;
                updateTimerDisplay();
            } else {
                clearInterval(intervalId);
                isRunning = false;
            }
        }, 1000);
    }
}

/**
 * Pauses the timer.
 */
function pauseTimer() {
    isRunning = false;
    clearInterval(intervalId);
}

/**
 * Resets the timer to its initial state.
 */
function resetTimer() {
    pauseTimer();
    timer = 25 * 60;
    updateTimerDisplay();
}


// --- Event Listeners ---
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
taskDetailsCloseButton.addEventListener('click', () => closeModal(taskDetailsModal));
quoteCloseButton.addEventListener('click', () => closeModal(quoteModal));
getQuoteButton.addEventListener('click', displayQuote);

// Quote buttons
quoteCloseOkayButton.addEventListener('click', () => closeModal(quoteModal));
quoteCloseGreatButton.addEventListener('click', () => closeModal(quoteModal));

window.addEventListener('click', (event) => {
    if (event.target === taskDetailsModal) closeModal(taskDetailsModal);
    if (event.target === quoteModal) closeModal(quoteModal);
});

// Pomodoro Timer Controls
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Initial renders
renderTasks();
updateTimerDisplay();