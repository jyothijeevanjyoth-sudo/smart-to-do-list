const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");

let tasks = [];
let currentFilter = "all";

loadTasks();

todoForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addTask();
});

searchInput.addEventListener("input", function() {
    searchTasks();
});

allBtn.addEventListener("click", function() {
    currentFilter = "all";
    renderTasks();
});

activeBtn.addEventListener("click", function() {
    currentFilter = "active";
    renderTasks();
});

completedBtn.addEventListener("click", function() {
    currentFilter = "completed";
    renderTasks();
});


function addTask() {

    const taskName = todoInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        priority: priority.value,
        dueDate: dueDate.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    todoInput.value = "";
    priority.value = "low";
    dueDate.value = "";

    renderTasks();
}


function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}


function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    const newName = prompt("Edit task:", task.name);

    if (newName === null) {
        return;
    }

    if (newName.trim() === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.name = newName.trim();

    saveTasks();
    renderTasks();
}


function toggleTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}


function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = filterTasks();

    const searchText = searchInput.value.toLowerCase().trim();

    filteredTasks = filteredTasks.filter(function(task) {
        return task.name.toLowerCase().includes(searchText);
    });

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");

        const taskName = document.createElement("span");
        taskName.classList.add("task-name");
        taskName.textContent = task.name;

        const taskDueDate = document.createElement("span");
        taskDueDate.classList.add("task-due-date");

        if (task.dueDate) {
            taskDueDate.textContent = "Due: " + task.dueDate;
        } else {
            taskDueDate.textContent = "No due date";
        }

        const priorityBadge = document.createElement("span");
        priorityBadge.classList.add("priority");
        priorityBadge.classList.add("priority-" + task.priority);
        priorityBadge.textContent =
            task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1);

        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskDueDate);
        taskInfo.appendChild(priorityBadge);


        const completeButton = document.createElement("button");

        completeButton.type = "button";

        if (task.completed) {
            completeButton.textContent = "Undo";
        } else {
            completeButton.textContent = "Complete";
        }

        completeButton.addEventListener("click", function() {
            toggleTask(task.id);
        });


        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            editTask(task.id);
        });


        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });


        li.appendChild(taskInfo);
        li.appendChild(completeButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    updateTaskCount();
}


function filterTasks() {

    if (currentFilter === "active") {

        return tasks.filter(function(task) {
            return !task.completed;
        });

    }

    if (currentFilter === "completed") {

        return tasks.filter(function(task) {
            return task.completed;
        });

    }

    return tasks;
}


function searchTasks() {
    renderTasks();
}


function updateTaskCount() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const active = total - completed;

    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}


function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    renderTasks();
}