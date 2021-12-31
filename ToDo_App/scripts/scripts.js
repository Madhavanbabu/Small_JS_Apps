// DOM elements
const addBtn = document.querySelector(".todo-add");
const todoList = document.querySelector(".todos-list");
const inputVal = document.querySelector('#todo_input_box');
const taskText = document.querySelector('.todo-text-span');
const deleteBtn = document.querySelector('.todo-delete');

// counter to hold id
let count = 0;
// global list
let taskList = [];

// listeners
// for adding the todo tasks
addBtn.addEventListener("click", (e) => {
    if(!inputVal.value)
        return;
    
    // increment the id counter
    count++;
    //  update the global task list
    taskList.push({
        id: count,
        text: inputVal.value,
        done: false
    });
    // append the new task to the DOM
    todoList.insertAdjacentHTML('beforeend', constructTask(count, inputVal.value));
    // clear after adding task
    inputVal.value = "";
    // update store with latest list
    updateStore();
});

// enter handler
inputVal.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      addBtn.click();
    }
});

// handle task edit 
todoList.addEventListener('input', (e) => {
    if(e.target.className == 'todo-text-span') {
        for(let i=0; i<taskList.length; i++) {
            if(taskList[i].id == e.target.id.split("_")[2]) {
                taskList[i].text = e.target.innerText;
                updateStore();
                break;
            }
        }
    }
});

// handle delete 
todoList.addEventListener('click',  (e) => {
    if(e.target.className.includes('todo-delete-pill')){
        for(let i=0; i<taskList.length; i++) {
            if(taskList[i].id == e.target.id.split("_")[2]) {
                taskList.splice(i, 1);
                updateStore();
                break;
            }
        }
        // hide after delete 
        (document.getElementById(`id_${e.target.id.split("_")[2]}`)).style.display = 'none';
    } 
});

// handle checkbox change
let ckChangeHandler = (e) => {
    let id = e.target.id.split("_")[2];
    let txt = document.getElementById(`task_text_${id}`);
    // toggle the strike thro based on checkbox toggle
    if(e.target.checked) {
        txt.classList.add('disable-task');
        txt.contentEditable = false;
    } else {
        txt.classList.remove('disable-task');
        txt.contentEditable = true;
    }
    for(let i=0; i<taskList.length; i++) {
        if(taskList[i].id == id) {
            taskList[i].done = e.target.checked;
            updateStore();
            break;
        }
    }
}

// to update local cache
let updateStore = () => {
    localStorage.setItem('task-list', JSON.stringify(taskList));
}

// to construct the task 
const constructTask = (count, task) => {
    return `
        <div class="todo-task card bg-success" id="id_${count}">
            <div class="todo-check">
                <input type="checkbox" class="todo-check-box" id="task_ck_${count}" onchange="ckChangeHandler(event)"/>
            </div>
            <div class="todo-text">
                <span contenteditable="true" class="todo-text-span" id="task_text_${count}" >${task}</span>
            </div>
            <div class="todo-delete">
                <div class="badge rounded-pill bg-danger todo-delete-pill" id="task_delete_${count}">Delete</div>
            </div>
        </div>`;
};

// to initialize base values and load from cache
let initialise = () => {
    let taskListStr = localStorage.getItem('task-list');
    // get value from global cache
    if(taskListStr) {
        taskList = JSON.parse(taskListStr);
        // remove all done tasks
        taskList = taskList.filter((elem) => {
            return elem.done == false;
        });
    }
    // append the list values to DOM
    for(let i=0; i<taskList.length;i++) {
        todoList.insertAdjacentHTML('beforeend', constructTask(taskList[i].id, taskList[i].text));
        if(taskList[i].id > count) {
            count = taskList[i].id;
        }
    }
}

// trigger intialize
initialise();
