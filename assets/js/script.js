const formInput = document.getElementById('form__input');
const taskListContainer = document.querySelector('.task-list-container');
let taskData = {
  tasks: []
};

// Saving tasks to localStorage
const saveToLocalStorage = function saveTasksToLocalStorage() {
  localStorage.setItem('allStoredTasks', JSON.stringify(taskData));
};

// Retrieving tasks from localStorage
const getFromLocalStorage = function getTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('allStoredTasks');
  if (storedTasks) {
    taskData = JSON.parse(storedTasks);
  }
};

// Removing any user-added markup from input data
const removeExtraneousContent = function removeExtraneousContent(string) {
  const trimmedString = string.trim();
  const temporaryDiv = document.createElement('div');
  temporaryDiv.textContent = trimmedString;
  return temporaryDiv.innerHTML;
};

// Generating list elements
const generateList = function generateList() {
  if (taskData.tasks.length < 1) {
    formInput.classList.remove('is-visible');
    taskListContainer.classList.add('has-no-items');
    return `<p class="no-tasks-message">
    You haven&apos;t set any tasks for the day.
    <a class="add-todo-link" href="#form">Add</a>&nbsp;a&nbsp;few. <br><br><small><strong>Tip</strong>: Each task should be unique and concise (32 characters at the most).</small> 
  </p>`;
  }

  const taskListElements = taskData.tasks.map((task, index) => {
    let done = '';
    if (task.done) done = ' class="done"';
    return `<li data-index="${index}"><button class = "list__delete-button" title="Delete task"><i class="list__delete-icon fas fa-trash"></i></button><span ${done}>${
      task.name
    }</span></li>`;
  });

  let ulMarkup = '';
  if (taskListElements.length >= 1) {
    taskListContainer.classList.remove('has-no-items');
    ulMarkup = `<ul class="task-list">${taskListElements.join('')}</ul>`;
  }
  return ulMarkup;
};

// Adding generated list to page
const addListToPage = function addListToPage() {
  taskListContainer.innerHTML = generateList();
};

// Removing message about duplicate input value
const removeErrorMessageGeneric = function removeMessageGeneric() {
  if (formInput.classList.contains('has-error')) {
    formInput.classList.remove('has-error');
  }
};

const removeErrorMessageKeyEvent = function removeMessageOnKeyEvent() {
  if (formInput.value === '') {
    formInput.classList.remove('has-error');
  }
};

const removeErrorMessageAnimationEnd = function removeErrorMessageOnAnimationEnd(event) {
  if (!event.target.matches('.form__error-message')) return;
  formInput.classList.remove('has-error');
};

// Using form-input data to render list
const submitHandler = function submitHandler(event) {
  const inputValue = removeExtraneousContent(formInput.value);
  const listElements = Array.from(document.getElementsByTagName('li'));
  let notDuplicate = true;

  if (!event.target.matches('#form')) return;
  event.preventDefault();
  if (!formInput || formInput.value.length < 1) return;

  listElements.forEach(element => {
    if (inputValue === element.querySelector('span').innerHTML) {
      formInput.classList.add('has-error');
      notDuplicate = false;
      return notDuplicate;
    }
    return notDuplicate;
  });

  if (notDuplicate) {
    taskData.tasks.push({ name: inputValue, done: false });
    addListToPage();
    saveToLocalStorage();

    formInput.value = '';
    formInput.focus();
  }
};

// Deleting a task
const deleteTask = function deleteSelectedTask(event) {
  if (!event.target.matches('.list__delete-button')) return;
  const index = event.target.parentNode.getAttribute('data-index');
  taskData.tasks.splice(index, 1);
  saveToLocalStorage();
  addListToPage();
};

// Pushing the status of completed tasks to the taskData object
const updateTaskStatus = function updateTaskStatus(event) {
  const index = event.target.parentNode.getAttribute('data-index');
  if (event.target.classList.contains('done')) {
    taskData.tasks[index].done = true;
  } else {
    taskData.tasks[index].done = false;
  }
};

// Trigger specific actions when click events occur outside the form
const clickHandler = function performActionsOnClick(event) {
  const noTasksMessage = document.querySelector('.no-tasks-message');

  if (event.target.matches('.list__delete-button')) {
    deleteTask(event);
  }

  if (event.target.matches('span')) {
    event.target.classList.toggle('done');
    updateTaskStatus(event);
    saveToLocalStorage();
  }

  if (event.target.matches('.add-todo-link')) {
    event.preventDefault();
    formInput.classList.add('is-visible');
    noTasksMessage.classList.add('is-hidden');
    formInput.focus();
  }

  if (event.target.matches('.title__button')) {
    formInput.classList.toggle('is-visible');
    if (noTasksMessage && taskData.tasks.length < 1) {
      noTasksMessage.classList.toggle('is-hidden');
    }
    formInput.focus();
  }

  removeErrorMessageGeneric();
};

// Event listeners
document.addEventListener('submit', submitHandler, false);
document.addEventListener('click', clickHandler, false);

document.addEventListener('keydown', removeErrorMessageKeyEvent, false);
document.addEventListener('keypress', removeErrorMessageKeyEvent, false);
document.addEventListener('animationend', removeErrorMessageAnimationEnd);

// Initial render
getFromLocalStorage();
addListToPage();
