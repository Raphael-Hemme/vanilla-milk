// References to DOM elements
const addTaskButton = document.getElementById('add-task-button');
const taskInput = document.getElementById('input-task');
const listContainer = document.getElementById('list-container')

// Set up basic data structure for storage of lists in local storage - no intention for DB use at this point.
let taskListData = []

const addTaskToTaskListData = () => {
  // Create data object for task with id and save it to the taskListData as id: {description: description, complete: bool}
  let currentId = Math.floor(Math.random() * 1000000000000).toString();
  let currentDescription = taskInput.value;
  taskListData.push({
    'id': currentId,
    'description': currentDescription,
    'completed': false
  });
  return taskListData[taskListData.length -1];
  }

const handleCompleteTaskButton = (e) => {
  let selectedDomTask = e.target.parentNode.parentNode.parentNode;
  let selectedTaskId = selectedDomTask.id;
  let currentIndex = taskListData.findIndex(el => el.id === selectedTaskId);
  if (currentIndex !== -1) {
    if (taskListData[currentIndex].completed === false) {
      taskListData[currentIndex].completed = true;
      selectedDomTask.className = 'completed-task';
    } else {
      taskListData[currentIndex].completed = false;
      selectedDomTask.className = 'active-task';
    }
  }
} 

const handleDeleteTaskButton = (e) => {
  let selectedDomTask = e.target.parentNode.parentNode.parentNode;
  let selectedTaskId = selectedDomTask.id;
  let currentIndex = taskListData.findIndex(el => el.id === selectedTaskId);
  taskListData.splice([currentIndex])
  const parentOfSelectedTask = selectedDomTask.parentNode;
  parentOfSelectedTask.removeChild(selectedDomTask);
} 

const addTaskToDom = (currTask) => {
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
  deleteTaskButton.addEventListener('click', handleDeleteTaskButton);

  // Create complete button and set its class
  let completeTaskButton = document.createElement('button');
  completeTaskButton.innerHTML = '<i class="fas fa-check"></i>';
  completeTaskButton.setAttribute('class', 'complete-task-button');
  completeTaskButton.addEventListener('click', handleCompleteTaskButton);

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
  newTask.setAttribute('id', currTask.id);

  // Append the whole new task to the list and reset the input field
  listContainer.appendChild(newTask);
  taskInput.value = '';
}

const addTaskToDataAndDom = () => {
  let currentTask = addTaskToTaskListData();
  addTaskToDom(currentTask);
  console.log(taskListData);
}

addTaskButton.addEventListener('click', addTaskToDataAndDom);



/* // generate date and instert copyright notice into the footer:
const addCopyrightNote = () => {
  let currentDate = new Date().getFullYear();
  let footer = document.getElementsByTagName('footer')[0];
  footer.innerHTML = `<p>&#xa9; ${currentDate} Raphael Hemme</p>`
}

addCopyrightNote(); */