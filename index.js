// References to DOM elements
const addTaskButton = document.getElementById('add-task-button');
const taskInput = document.getElementById('input-task');
const listContainer = document.getElementById('list-container')

// Declare strings with the Fontawesome icon elements to use in createAnyButton string
const iconEditTaskButton = '<i class="fas fa-pencil-alt"></i>';
const iconSaveOnEditTaskButton = '<i class="far fa-save"></i>';
const iconDeleteTaskButton = '<i class="far fa-trash-alt"></i>';
const iconCompleteTaskButton = '<i class="fas fa-check"></i>';


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

// Declarations of the individual button event handlers (except the original addTask button, which currently is the all encompassing)

const determineDomTaskForClickedButton = (evt) => {
  let selectedTarget = evt.target;
  let selectedDomTask;
  if (selectedTarget.nodeName === 'BUTTON') {
    selectedDomTask = evt.target.parentNode.parentNode;
  } else {
    selectedDomTask = evt.target.parentNode.parentNode.parentNode;
  }
  return selectedDomTask;
} 

const handleCompleteTaskButton = (e) => {
  // This identification part below (the three variable initializations) is repeated in all functions button handlers and should be refactored into a separate function later on. 
  let selectedDomTask = determineDomTaskForClickedButton(e);
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

// There is a bug somewhere in here that sometimes (not yet understood the pattern) leads to
// a removeChild of the whole listContainer Element instead of the selectedTask.
// But not entirely consistantly. -> Refactor to address the child via the id instead of
// DOM traversal might be a solution.
// Edit: The problem is that if you click on the button lable (the font awesome logo) the lable is
// the e.taget while I assumed the button to be the e.target. (that also explaines the strange 
// additional .parentNode that was neccessary to get to the whole task element.)

const handleDeleteTaskButton = (e) => {
  let selectedDomTask = determineDomTaskForClickedButton(e);
  console.log('selectedDomTask: ', selectedDomTask);
  let selectedTaskId = selectedDomTask.id;
  console.log(selectedTaskId)
  let currentIndex = taskListData.findIndex(el => el.id === selectedTaskId);
  taskListData.splice([currentIndex]);
  const listContainer = document.getElementById('list-container');
  listContainer.removeChild(selectedDomTask);
} 

const handleSaveOnEditButton = (selectedDomTask, selectedTaskId, currentIndex) => {
  let currentTaskControllContainer = selectedDomTask.lastChild;
  const currInputId = `${selectedTaskId}-input`;
  const newInputElement = document.getElementById(currInputId);
  const newInputElementValue = newInputElement.value;
  taskListData[currentIndex].description = newInputElementValue;
  let editedTaskLable = document.createElement('span');
  let editedTaskDescription = document.createTextNode(taskListData[currentIndex].description);
  editedTaskLable.appendChild(editedTaskDescription);
  editedTaskLable.setAttribute('class', 'active-task-lable');
  selectedDomTask.insertBefore(editedTaskLable, newInputElement);
  selectedDomTask.removeChild(newInputElement);
  const currSaveButtonId = `${selectedTaskId}-saveButton`;
  const currSaveButton = document.getElementById(currSaveButtonId);
  selectedDomTask.removeChild(currSaveButton);
  currentTaskControllContainer.classList.toggle('hide');
}

const handleEditTaskButton = (e) => {
  // This identification part below (the three variable initializations) is repeated in all functions button handlers and should be refactored into a separate function later on. 
  let selectedDomTask = determineDomTaskForClickedButton(e);
  let selectedTaskId = selectedDomTask.id;
  let currentIndex = taskListData.findIndex(el => el.id === selectedTaskId);
  if (currentIndex !== -1) {
    let currentTaskData = taskListData[currentIndex];
    let currentLable = selectedDomTask.firstChild;

    let currentTaskControllContainer = selectedDomTask.lastChild;
    console.log('setting currentTaskControllContainer ', currentTaskControllContainer)
    
    selectedDomTask.removeChild(currentLable)

    let editInputField = document.createElement('input');
    editInputField.setAttribute('id', `${selectedTaskId}-input`);
    editInputField.value = currentTaskData.description;
    selectedDomTask.insertBefore(editInputField, selectedDomTask.firstChild)

    let saveTaskButton = document.createElement('button');
    saveTaskButton.innerHTML = '<i class="far fa-save"></i>';
    saveTaskButton.setAttribute('class', 'save-on-edit-task-button');
    saveTaskButton.setAttribute('id', `${selectedTaskId}-saveButton`);
    saveTaskButton.addEventListener('click', function () {handleSaveOnEditButton(selectedDomTask, selectedTaskId, currentIndex)});
    selectedDomTask.insertBefore(saveTaskButton, selectedDomTask.lastChild)
    currentTaskControllContainer.classList.toggle('hide');
    console.log(currentTaskControllContainer.className);
  }
} 

// Create any button, by providing its functionality (for injecting it as part of variable and class names etc.), set its class and add the respective event listener.
const createAnyButton = (functionality, functionalityFunction) => {
  let currFaIcon = `icon${functionality}TaskButton`;
  let currTaskButton = document.createElement('button');
  currTaskButton.innerHTML = eval(currFaIcon);
  currTaskButton.setAttribute('class', `${functionality.toLowerCase()}-task-button`);
  currTaskButton.addEventListener('click', functionalityFunction);
  return(currTaskButton);
}


const addTaskToDom = (currTask) => {
  // Get value from input field, create lable for the new task and set its class
  let currentDescription = taskInput.value;
  let newTaskLable = document.createElement('span');
  let newTaskDescription = document.createTextNode(currentDescription);
  newTaskLable.appendChild(newTaskDescription);
  newTaskLable.setAttribute('class', 'active-task-lable');

  // Create edit buttons for edit, delete and complete
  let editTaskButton = createAnyButton('Edit', handleEditTaskButton);
  let deleteTaskButton = createAnyButton('Delete', handleDeleteTaskButton);
  let completeTaskButton = createAnyButton('Complete', handleCompleteTaskButton);

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