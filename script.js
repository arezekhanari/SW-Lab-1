let currentCardId = null;
let currentColumnId = "";

function addTask(columnId) {
  currentColumnId = columnId;
  currentCardId = null; // Set to null to indicate adding a new task
  document.getElementById("modal-title").textContent = "Add Task";
  document.getElementById("modal-action").textContent = "Add Task";

  // Clear any existing values in the input fields
  document.getElementById("task-title").value = "";
  document.getElementById("task-priority").value = "Low";

  // Open the modal for adding
  document.getElementById("task-modal").style.display = "flex";
}

function openEditModal(cardId) {
  currentCardId = cardId; // Store the ID of the card being edited
  currentColumnId = null; // No column ID needed for editing

  const card = document.getElementById(cardId);
  const title = card.querySelector(".task-title").textContent;
  const priority = card.querySelector(".task-priority").textContent;

  // Pre-fill modal with existing task details
  document.getElementById("task-title").value = title;
  document.getElementById("task-priority").value = priority;

  // Change modal title and button text for editing
  document.getElementById("modal-title").textContent = "Edit Task";
  document.getElementById("modal-action").textContent = "Save Changes";

  // Open the modal for editing
  document.getElementById("task-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("task-modal").style.display = "none";
}

function handleTaskAction() {
  const title = document.getElementById("task-title").value;
  const priority = document.getElementById("task-priority").value;

  if (title === "") {
    alert("Please enter a task title.");
    return;
  }

  if (currentCardId) {
    // Edit existing task
    const card = document.getElementById(currentCardId);
    card.querySelector(".task-title").textContent = title;
    card.querySelector(".task-priority").textContent = `${priority}`;
    card.className = `card ${priority}`;
  } else {
    // Add new task
    const card = document.createElement("div");
    card.className = `card ${priority}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "card-content";

    const taskTitle = document.createElement("div");
    taskTitle.className = "task-title";
    taskTitle.textContent = title;

    const taskPriority = document.createElement("div");
    taskPriority.className = "task-priority";
    taskPriority.textContent = `${priority}`;

    contentDiv.appendChild(taskTitle);
    contentDiv.appendChild(taskPriority);

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";
    editButton.onclick = () => openEditModal(card.id);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteTask(card.id);

    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    card.appendChild(contentDiv);
    card.appendChild(buttonGroup);

    document.getElementById(currentColumnId).appendChild(card);
  }

  initializeDragAndDrop();
  sortTasksByPriority();
  closeModal();
}

function deleteTask(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.remove();
  } else {
    console.error("Card not found:", cardId);
  }
}

// Add draggable attributes to all cards
let draggedCard = null;
let placeholder = document.createElement("div");
placeholder.className = "placeholder";

function initializeDragAndDrop() {
  document.querySelectorAll(".card").forEach((card) => {
    card.setAttribute("draggable", true);
    card.addEventListener("dragstart", onDragStart);
    card.addEventListener("dragend", onDragEnd);
  });

  document.querySelectorAll(".column-body").forEach((column) => {
    column.addEventListener("dragover", onDragOver);
    column.addEventListener("drop", onDrop);
    column.addEventListener("dragleave", onDragLeave);
  });
}

function onDragStart(event) {
  draggedCard = this;
  setTimeout(() => (this.style.display = "none"), 0);
}

function onDragEnd(event) {
  setTimeout(() => {
    this.style.display = "flex";
    placeholder.remove();
    draggedCard = null;
    sortTasksByPriority();
  }, 0);
}

function onDragOver(event) {
  event.preventDefault();
  const column = event.currentTarget;

  if (!column.contains(placeholder) && column.children.length === 0) {
    column.appendChild(placeholder);
  } else if (!column.contains(placeholder)) {
    column.insertBefore(placeholder, null);
  }
}

function onDrop(event) {
  event.preventDefault();
  const column = event.currentTarget;

  if (placeholder) {
    column.insertBefore(draggedCard, placeholder);
    placeholder.remove();
  } else {
    column.appendChild(draggedCard);
  }

  initializeDragAndDrop();
}

function onDragLeave(event) {
  const column = event.currentTarget;
  if (column.contains(placeholder) && column.children.length === 1) {
    placeholder.remove();
  }
}

function sortTasksByPriority() {
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  document.querySelectorAll(".column-body").forEach((column) => {
    const tasks = Array.from(column.querySelectorAll(".card"));
    tasks.sort((a, b) => {
      const priorityA =
        priorityOrder[a.querySelector(".task-priority").textContent] || 4;
      const priorityB =
        priorityOrder[b.querySelector(".task-priority").textContent] || 4;
      return priorityA - priorityB;
    });
    tasks.forEach((task) => column.appendChild(task));
  });
}

document.addEventListener("DOMContentLoaded", initializeDragAndDrop);
