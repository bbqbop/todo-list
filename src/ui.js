import { exportList as projects, findCurrentProject, findCurrentTask } from "./index.js";

export default function initializeUI(){
    const content = document.querySelector('.content');

    const createInput = function(type, labelText, name, parentElement, value, dataIdx){
        const label = document.createElement('legend');
        label.classList.add(name);
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = type;
        input.id = name;
        input.value = value || '';
        input.dataset.idx = dataIdx;
        label.append(input);
        parentElement.append(label);

        return input
    }

    // Add todo Task form

    const taskFormWrapper = document.createElement('div');
    taskFormWrapper.classList.add('taskFormWrapper');

    const taskForm = document.createElement('form');
    taskForm.classList.add('taskForm');
    taskForm.id = 'taskForm';
    taskForm.style.display = 'none';

    const taskLegend = document.createElement('legend');
    taskLegend.textContent = 'New Task:'
    taskForm.append(taskLegend);

    createInput('text','Title: ','title', taskForm);
    createInput('text','Description: ','desc', taskForm);
    createInput('date','Due Date: ','date', taskForm);
    createInput('range','Priority: ','prio', taskForm);
    createInput('submit','','submit', taskForm, 'save');

    taskFormWrapper.append(taskForm)
    content.append(taskFormWrapper);

    const addRangeInputAttrs = function(selector){
        const prioInp = document.querySelector(selector);
        prioInp.min = '1';
        prioInp.max = '3';
        prioInp.step = '1';
    }

    addRangeInputAttrs('#prio');

    // Add project form

    const projectFormWrapper = document.createElement('div');
    projectFormWrapper.classList.add('projectFormWrapper');

    const projectForm = document.createElement('form');
    projectForm.classList.add('projectForm');
    projectForm.id = 'projectForm';
    projectForm.style.display = 'none';


    const projectLegend = document.createElement('legend');
    projectLegend.textContent = 'New Project:'
    projectForm.append(projectLegend);

    createInput('text', 'Title: ', 'title', projectForm)
    createInput('submit','','submit', projectForm, 'safe');

    projectFormWrapper.append(projectForm);

    content.append(projectFormWrapper);

    
    // Dynamic objects:
    // Project List

    const projectSidebar = document.createElement('div');
    projectSidebar.classList.add('projectSidebar');
    content.append(projectSidebar);

    const updateProjectSidebar = function(){
        projectSidebar.innerHTML = '';
        projects.forEach( project => {
            const div = document.createElement('div');
            div.classList.add('projects');

            const btn = document.createElement('button');
            btn.dataset.idx = project.idx;
            btn.textContent = project.title;
            
            const erase = document.createElement('button')
            erase.dataset.idx = project.idx;
            erase.textContent = 'X';
           
            div.append(btn, erase);
            projectSidebar.append(div);
        });  
        const addProjectBtn = document.createElement('button');
        addProjectBtn.classList.add('addProjectBtn');
        addProjectBtn.textContent = '+ add new project'
        projectSidebar.append(addProjectBtn);
    };


    // Task list
   
    const todoView = document.createElement('div')
    todoView.classList.add('todoView');
    content.append(todoView); 

    const updateTodoView = function() {
        todoView.innerHTML = '';

        const addTaskBtn = document.createElement('button');
        addTaskBtn.classList.add('addTaskBtn');
        addTaskBtn.textContent = '+ add new task'
        todoView.append(addTaskBtn);

        const currentProject = findCurrentProject();

        if (!currentProject) return;

        for (let task of currentProject.todoList) {
            const taskIdx = currentProject.todoList.indexOf(task)

            const div = document.createElement('div');
            div.classList.add('todos');
            div.dataset.idx = taskIdx;

            const title = document.createElement('button');
            title.classList.add('todoTitleBtns')
            title.textContent = task.title;
            title.dataset.idx = taskIdx;

            const priority = document.createElement('div');
            if (task.isDone) priority.style.backgroundColor = 'green';
            else if (task.prio == 1) priority.style.backgroundColor = 'yellow';
            else if (task.prio == 2) priority.style.backgroundColor = 'orange';
            else if (task.prio == 3) priority.style.backgroundColor = 'red';

            const checkbox = document.createElement('input');
            checkbox.dataset.idx = taskIdx;
            checkbox.type = 'checkbox';
            checkbox.id = 'isDone';
            checkbox.checked = task.isDone;

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('todoDeleteBtns')
            deleteBtn.textContent = 'X' 
            deleteBtn.dataset.idx = taskIdx;

            div.append(title, priority, checkbox, deleteBtn);
            todoView.append(div);
        }
        
    }

    // Focussed Task 

    const focusTask = document.createElement('div');
    focusTask.classList.add('focusTask');
    content.append(focusTask);

    const updateFocusTask = function() {
        focusTask.innerHTML = '';
        const currentTask = findCurrentTask();
        const currentProject = findCurrentProject();
        
        if (!currentTask) return;

        const taskIdx = currentProject.todoList.indexOf(currentTask);

        const projectTitle = document.createElement('h1');
        projectTitle.textContent = currentProject.title;

        const projectLen = document.createElement('p');
        projectLen.textContent = `${taskIdx + 1}/${currentProject.todoList.length}`

        focusTask.append(projectTitle, projectLen);
        // (type, labelText, name, parentElement, value, dataIdx)
        createInput('text','', 'title', focusTask, currentTask.title, taskIdx);
        createInput('text','', 'desc', focusTask, currentTask.desc, taskIdx);
        createInput('date','', 'dueDate', focusTask, currentTask.dueDate, taskIdx);
        createInput('range','Priority: ' ,'prio', focusTask, currentTask.prio, taskIdx)
        createInput('checkbox','Done', 'isDone', focusTask, currentTask.isDone, taskIdx);
        addRangeInputAttrs('.focusTask #prio');

        const checkbox = document.querySelector('.focusTask input[type = "checkbox"]')
        checkbox.checked = currentTask.isDone;
        document.querySelector('.focusTask input[type = "range"]').disabled = currentTask.isDone;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('todoDeleteBtns')
        deleteBtn.textContent = 'X' 
        deleteBtn.dataset.idx = taskIdx;

        const nextBtn = document.createElement('button');
        nextBtn.classList.add('nextBtn');
        nextBtn.dataset.idx = taskIdx;
        nextBtn.innerHTML = '&#x27A1;'
        focusTask.append(deleteBtn, nextBtn);

        if ( currentTask.isDone ) {
            focusTask.style.backgroundColor = 'green';
        }
        else {
            switch (parseInt(currentTask.prio)){
                case 1 : 
                    focusTask.style.backgroundColor = 'yellow';
                    break;
                case 2 : 
                    focusTask.style.backgroundColor = 'orange';
                    break;
                case 3 : 
                    focusTask.style.backgroundColor = 'red';
                    break;
            }
        }
    }

    

    return {
        initializeUI,
        updateProjectSidebar,
        updateTodoView,
        updateFocusTask
    }
}