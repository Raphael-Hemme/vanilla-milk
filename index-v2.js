// v2 of the index is an overhaul to make the app work from the task list 
// data structure (the array of objects which are the individual tasks) as
// a starting point and render the contents of that structure to the DOM
// instead of working from the dom and replicating the data in the array.

// To me, this seems to be a much more sensible "architecture" or approach. 
// But v1 was useful as a consolidation exercise for DOM manipulation and
// traversal anyway.


// References to DOM elements
const addTaskButton = document.getElementById('add-task-button');
const taskInput = document.getElementById('input-task');
const listContainer = document.getElementById('list-container');

const deleteListButton = document.getElementById('delete-list-button');


// Declare strings with the Fontawesome icon elements to use in createAnyButton string
const iconEditTaskButton = '<i class="fas fa-pencil-alt"></i>';
const iconSaveOnEditTaskButton = '<i class="far fa-save"></i>';
const iconDeleteTaskButton = '<i class="far fa-trash-alt"></i>';
const iconCompleteTaskButton = '<i class="fas fa-check"></i>';


////// Set up basic data structure for storage of lists in local storage - no intention for DB use at this point.
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


////// Set up local storage loading and saving
document.addEventListener('DOMContentLoaded', () => {
  let currentStorage = JSON.parse(window.localStorage.getItem('vanilla-milk-list'))
  if (currentStorage) {
    currentStorage.map(el => taskListData.push(el))
  }
  updateDomTaskList();
  taskInput.focus();
})

const saveTaskListDataToLocalStorage = () => {
  window.localStorage.setItem('vanilla-milk-list', JSON.stringify(taskListData));
}

const handleDeleteList = () => {
  window.localStorage.clear();
  taskListData = [];
  updateDomTaskList();
}

// Create any button, by providing its functionality (for injecting it as part of variable and class names etc.), set its class and add the respective event listener.
const createAnyButton = (functionality, currId) => {
  let currFaIcon = `icon${functionality}TaskButton`;
  let currTaskButton = document.createElement('button');
  currTaskButton.innerHTML = eval(currFaIcon);
  currTaskButton.setAttribute('class', `${functionality.toLowerCase()}-task-button`);
  currTaskButton.setAttribute('id', `${functionality.toLowerCase()}-${currId}-button`)
  return(currTaskButton);
}


//////// Handler functions for task-buttons (edit, complete, delete) ////////
const handleDeleteTaskButton = (selectedTaskId) => {
  let currentIndex = taskListData.findIndex(el => el.id === selectedTaskId);
  taskListData.splice([currentIndex], 1);
  saveTaskListDataToLocalStorage();
  updateDomTaskList();
} 

const handleCompleteTaskButton = (selectedTaskId) => {
  let currentIndex = taskListData.findIndex(el => el.id === selectedTaskId);
  taskListData[currentIndex].completed = !taskListData[currentIndex].completed;
  saveTaskListDataToLocalStorage();
  updateDomTaskList();
}

const handleEditTaskButton = (selectedTaskId, selectedDomTask) => {
  let currentIndex = taskListData.findIndex(el => el.id === selectedTaskId);
  let currentTaskData = taskListData[currentIndex];

  // Identify task Lable and toggle its CSS class so 'display' is set to 'none'
  let taskLable = selectedDomTask.firstChild;
  taskLable.classList.toggle('hide');

  // Create input field, set its value to the value of the lable and insert input field where lable was before
  let editInputField = document.createElement('input');
  editInputField.setAttribute('id', `${selectedTaskId}-input`);
  editInputField.value = currentTaskData.description;
  selectedDomTask.insertBefore(editInputField, selectedDomTask.lastChild);

  // Identify container span for all the task control buttons and toggle its CSS class so 'display' is set to 'none'
  let currTaskControlContainer = selectedDomTask.lastChild;
  currTaskControlContainer.classList.toggle('hide');

  // Create save button and insert it into the task span after the input field;
  let currSaveButton = createAnyButton('SaveOnEdit', selectedTaskId);
  selectedDomTask.insertBefore(currSaveButton, selectedDomTask.lastChild);
}

const handleSaveOnEdit = (selectedTaskId, selectedDomTask) => {
  let currEditSaveButton = document.getElementById(`saveonedit-${selectedTaskId}-button`)
  let currEditInput = document.getElementById(`${selectedTaskId}-input`)
  console.log(currEditInput)
  let currEditInputValue = currEditInput.value;
  let currentIndex = taskListData.findIndex(el => el.id === selectedTaskId);
  taskListData[currentIndex].description = currEditInputValue;

  //remove the input field and saveOnEdit Button again.
  selectedDomTask.removeChild(currEditInput);
  selectedDomTask.removeChild(currEditSaveButton);

  saveTaskListDataToLocalStorage();
  updateDomTaskList();
};

const handleFunctionalitySelectionAndCallThatFunction = (e) => {
  let selectedTarget = e.target;
  let selectedDomTask = {};
  let selectedTaskId, buttonFunctionality;

  if (selectedTarget.nodeName === 'BUTTON' && selectedTarget.id.split('-')[0] === 'saveonedit') {
    selectedDomTask = e.target.parentNode;
  } else if (selectedTarget.nodeName === 'I' && selectedTarget.parentNode.id.split('-')[0] === 'saveonedit') {
    selectedTarget = e.target.parentNode;
    selectedDomTask = e.target.parentNode.parentNode;
  } else if (selectedTarget.nodeName === 'BUTTON') {
    selectedDomTask = e.target.parentNode.parentNode;
  } else if (selectedTarget.nodeName === 'I') {
    selectedTarget = e.target.parentNode;
    selectedDomTask = e.target.parentNode.parentNode.parentNode;
  } else {
    console.log('Got something else')
  }
  if (selectedDomTask.id) selectedTaskId = selectedDomTask.id;
  buttonFunctionality = selectedTarget.id.split('-')[0];
//  return [selectedDomTask, selectedTaskId, buttonFunctionality];
  switch (buttonFunctionality) {
    case ('delete'):
      console.log(selectedTaskId);
      handleDeleteTaskButton(selectedTaskId);
      break;
    case ('complete'):
      console.log(selectedTaskId);
      handleCompleteTaskButton(selectedTaskId);
      break;
    case ('edit'):
      console.log(selectedTaskId);
      handleEditTaskButton(selectedTaskId, selectedDomTask);
      break;
    case ('saveonedit'):
      console.log(selectedTaskId);
      handleSaveOnEdit(selectedTaskId, selectedDomTask);
      break;
    default:
      console.log(`You clicked on ${e.target}`)
      break;
  }
} 


const addTaskToDom = (currTask) => {
  // Get value from input field, create lable for the new task and set its class
  let currentDescription = currTask.description;
  let currId = currTask.id;
  let newTaskLable = document.createElement('span');
  let newTaskDescription = document.createTextNode(currentDescription);
  newTaskLable.appendChild(newTaskDescription);
  if (currTask.completed) {
    newTaskLable.setAttribute('class', 'completed-task-lable');
  } else {
    newTaskLable.setAttribute('class', 'active-task-lable');
  };
  

  // Create edit buttons for edit, delete and complete
  let editTaskButton = createAnyButton('Edit', currId);
  let deleteTaskButton = createAnyButton('Delete', currId);
  let completeTaskButton = createAnyButton('Complete', currId);

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
  if (currTask.completed) {
    newTask.setAttribute('class', `completed-task`);
  } else {
    newTask.setAttribute('class', `active-task`);
  };
  newTask.setAttribute('id', currTask.id);

  // Append the whole new task to the list and clear the input field
  listContainer.insertBefore(newTask, listContainer.firstChild);
  taskInput.value = '';
}

const updateDomTaskList = () => {
  // Clear current DOM task list before rendering updated task list from task list data
  let domActiveListItems = document.querySelectorAll('.active-task, .completed-task');
  if (domActiveListItems.length >= 1) {
    for(let i = domActiveListItems.length -1; i >= 0; i--) {
      listContainer.removeChild(domActiveListItems[i]);
    }
  } 
  // Rendering the updated task list data to the DOM
  for (let el of taskListData) {
    addTaskToDom(el);
  }
}

const handleAddButton = () => {
  let currentTask = addTaskToTaskListData();
  saveTaskListDataToLocalStorage();
  updateDomTaskList();
}

////// Event Listeners

addTaskButton.addEventListener('click', handleAddButton);
taskInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTaskButton.click();
  }
})
listContainer.addEventListener('click', handleFunctionalitySelectionAndCallThatFunction)

deleteListButton.addEventListener('click', handleDeleteList);

/* // generate date and instert copyright notice into the footer:
const addCopyrightNote = () => {
  let currentDate = new Date().getFullYear();
  let footer = document.getElementsByTagName('footer')[0];
  footer.innerHTML = `<p>&#xa9; ${currentDate} Raphael Hemme</p>`
}

addCopyrightNote(); */