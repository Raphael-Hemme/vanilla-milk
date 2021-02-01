
const addTaskButton = document.getElementById('add-task-button');
const taskInput = document.getElementById('input-task');
const listContainer = document.getElementById('list-container')

const addTask = () => {
  // Get value from input field, create lable for the new task and set its class
  let currentDescription = taskInput.value;
  let newTaskLable = document.createElement('span');
  let newTaskDescription = document.createTextNode(currentDescription);
  newTaskLable.appendChild(newTaskDescription);
  newTaskLable.setAttribute('class', 'active-task-lable');

  // Create edit button and set its class
  let editTaskButton = document.createElement('button');
  editTaskButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
  editTaskButton.setAttribute('class', 'edit-task-button');

  // Create delete button and set its class
  let deleteTaskButton = document.createElement('button');
  deleteTaskButton.innerHTML = '<i class="far fa-trash-alt"></i>';
  deleteTaskButton.setAttribute('class', 'delete-task-button');

  // Create complete button and set its class
  let completeTaskButton = document.createElement('button');
  completeTaskButton.innerHTML = '<i class="fas fa-check"></i>';
  completeTaskButton.setAttribute('class', 'complete-task-button');

  // Create taskControlContainer, insert the buttons into it and add a class
  let taskControlContainer = document.createElement('span');
  taskControlContainer.appendChild(completeTaskButton);
  taskControlContainer.appendChild(editTaskButton);
  taskControlContainer.appendChild(deleteTaskButton);
  taskControlContainer.setAttribute('class', 'task-control-container');

  // Create full task element and insert all parts into it
  let newTask = document.createElement('span');
  newTask.appendChild(newTaskLable);
  newTask.appendChild(taskControlContainer)
  newTask.setAttribute('class', 'active-task');

  // Append the whole new task to the list
  listContainer.appendChild(newTask);
  taskInput.value = '';
}

addTaskButton.addEventListener('click', addTask);



/* // generate date and instert copyright notice into the footer:
const addCopyrightNote = () => {
  let currentDate = new Date().getFullYear();
  let footer = document.getElementsByTagName('footer')[0];
  footer.innerHTML = `<p>&#xa9; ${currentDate} Raphael Hemme</p>`
}

addCopyrightNote(); */