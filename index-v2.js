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


// Handler functions for task-buttons (edit, complete, delete)
const handleDeleteTaskButton = (selectedTaskId) => {
  let currentIndex = taskListData.findIndex(el => el.id === selectedTaskId);
  console.log(currentIndex)
  taskListData.splice([currentIndex], 1);
  updateDomTaskList();
} 

const handleCompleteTaskButton = (selectedTaskId) => {
  let currentIndex = taskListData.findIndex(el => el.id === selectedTaskId);
  console.log(currentIndex)
  taskListData[currentIndex].completed = !taskListData[currentIndex].completed;
  updateDomTaskList();
} 


const handleFunctionalitySelectionAndCallThatFunction = (e) => {
  let selectedTarget = e.target;
  let selectedDomTask, selectedTaskId, buttonFunctionality;
  if (selectedTarget.nodeName === 'BUTTON') {
    selectedDomTask = e.target.parentNode.parentNode;
  } else if (selectedTarget.nodeName === 'I') {
    selectedTarget = e.target.parentNode;
    selectedDomTask = e.target.parentNode.parentNode.parentNode;
  } else {
    console.log('Got something else')
  }
  selectedTaskId = selectedDomTask.id
  buttonFunctionality = selectedTarget.id.split('-')[0];
//  return [selectedDomTask, selectedTaskId, buttonFunctionality];
  switch (buttonFunctionality) {
    case ('Delete'):
      console.log(selectedTaskId);
      handleDeleteTaskButton(selectedTaskId);
      break;
      case ('Complete'):
        console.log(selectedTaskId);
        handleCompleteTaskButton(selectedTaskId);
        break;
    default:
      console.log('something was clicked')
      break;
  }
} 






// Create any button, by providing its functionality (for injecting it as part of variable and class names etc.), set its class and add the respective event listener.
const createAnyButton = (functionality, currId) => {
  let currFaIcon = `icon${functionality}TaskButton`;
  let currTaskButton = document.createElement('button');
  currTaskButton.innerHTML = eval(currFaIcon);
  currTaskButton.setAttribute('class', `${functionality.toLowerCase()}-task-button`);
  currTaskButton.setAttribute('id', `${functionality}-${currId}`)
  return(currTaskButton);
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
  listContainer.appendChild(newTask);
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
  updateDomTaskList();
}

addTaskButton.addEventListener('click', handleAddButton);
listContainer.addEventListener('click', handleFunctionalitySelectionAndCallThatFunction)

/* // generate date and instert copyright notice into the footer:
const addCopyrightNote = () => {
  let currentDate = new Date().getFullYear();
  let footer = document.getElementsByTagName('footer')[0];
  footer.innerHTML = `<p>&#xa9; ${currentDate} Raphael Hemme</p>`
}

addCopyrightNote(); */