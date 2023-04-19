import { exportList as projects, findCurrentProject, findCurrentTask } from "./index.js";
import { iconPlus, iconMinus, iconEnter } from "./icons.js";

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
    
    // Project List

    const projectSidebar = document.createElement('div');
    projectSidebar.classList.add('projectSidebar');
    content.append(projectSidebar);

    const logo = document.createElement('h1');
    logo.textContent = 'Todo-List'
    
    const projectList = document.createElement('div');
    projectList.classList.add('projectList')
    projectSidebar.append(logo, projectList)

    const updateProjectSidebar = function(){
        projectList.innerHTML = '';
        projects.forEach( project => {
            const div = document.createElement('div');
            div.classList.add('projects');
            div.dataset.idx = project.idx;

            const btn = document.createElement('button');
            btn.dataset.idx = project.idx;
            btn.textContent = project.title;
            
            const erase = document.createElement('button')
            erase.dataset.idx = project.idx;
            erase.textContent = 'X';
           
            div.append(btn, erase);
            
            projectList.append(div);

            if (project === findCurrentProject()){
                btn.classList.add('active')
            }
        });  
    };

    const addProjectBtn = document.createElement('button');
    addProjectBtn.classList.add('addProjectBtn');
    addProjectBtn.append(iconPlus);
   
    projectSidebar.append(addProjectBtn);

     // Add project form

     const projectFormWrapper = document.createElement('div');
     projectFormWrapper.classList.add('projectFormWrapper');
 
     const projectForm = document.createElement('form');
     projectForm.classList.add('projectForm');
     projectForm.id = 'projectForm';

     createInput('text', '', 'title', projectForm)
     const submit = document.createElement('button');
     submit.type = 'submit'
     submit.id = 'submit';
     submit.append(iconEnter);
     projectForm.append(submit);   
     
     projectFormWrapper.append(projectForm);
 
     projectSidebar.append(projectFormWrapper);


    // Task list
   
    const main = document.createElement('div');
    main.classList.add('main');
    content.append(main);

    const addTaskBtn = document.createElement('button');
    addTaskBtn.classList.add('addTaskBtn');
    const p = document.createElement('p');
    p.textContent = '+ add new task (space)';
    addTaskBtn.append(p);
    main.append(addTaskBtn);

    const todoView = document.createElement('div')
    todoView.classList.add('todoView');
    main.append(todoView); 

    const updateTodoView = function() {
        todoView.innerHTML = '';

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

            if (task === findCurrentTask()){
                title.classList.add('active')
            }

            const priority = document.createElement('div');
            priority.classList.add('taskPriority')
            if (task.isDone) priority.style.backgroundColor = 'green';
            else if (task.prio == 1) priority.style.backgroundColor = 'yellow';
            else if (task.prio == 2) priority.style.backgroundColor = 'orange';
            else if (task.prio == 3) priority.style.backgroundColor = 'red';

            const checkboxContainer = document.createElement('label');
            checkboxContainer.classList.add('checkboxContainer');
            const checkbox = document.createElement('input');
            checkbox.dataset.idx = taskIdx;
            checkbox.type = 'checkbox';
            checkbox.id = 'isDone';
            checkbox.classList.add('checkbox');
            checkbox.checked = task.isDone;
            const checkMark = document.createElement('span');
            checkMark.classList.add('checkMark');
            checkboxContainer.append(checkbox, checkMark);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('todoDeleteBtns')
            deleteBtn.textContent = 'X' 
            deleteBtn.dataset.idx = taskIdx;

            div.append(title, priority, checkboxContainer, deleteBtn);
            todoView.append(div);
        }
    }

    // Focussed Task 

    const focusTask = document.createElement('div');
    focusTask.classList.add('focusTask');
    main.append(focusTask);

    const updateFocusTask = function() {
        focusTask.innerHTML = '';
        const task = findCurrentTask();
        const project = findCurrentProject();
        
        if (!task) {
            return;
        }
        const taskIdx = project.todoList.indexOf(task);

        const projectTitle = document.createElement('h1');
        projectTitle.textContent = project.title;

        const projectLen = document.createElement('p');
        projectLen.textContent = `${taskIdx + 1}/${project.todoList.length}`

        focusTask.append(projectTitle, projectLen);
        // (type, labelText, name, parentElement, value, dataIdx)
        createInput('text','', 'title', focusTask, task.title, taskIdx);
        createInput('text','', 'desc', focusTask, task.desc, taskIdx);
        createInput('date','', 'dueDate', focusTask, task.dueDate, taskIdx);
        createInput('range','Priority: ' ,'prio', focusTask, task.prio, taskIdx);

        const priority = document.createElement('div');
        priority.classList.add('taskPriority')
        if (task.isDone) priority.style.backgroundColor = 'green';
        else if (task.prio == 1) priority.style.backgroundColor = 'yellow';
        else if (task.prio == 2) priority.style.backgroundColor = 'orange';
        else if (task.prio == 3) priority.style.backgroundColor = 'red';
        focusTask.append(priority);

        addRangeInputAttrs('.focusTask #prio');

        const wrapper = document.createElement('div')
        wrapper.classList.add('wrapper')
        const checkboxContainer = document.createElement('label');
        checkboxContainer.classList.add('checkboxContainer');
        const p = document.createElement('p');
        p.textContent = 'Done?'
        const checkbox = document.createElement('input');
        checkbox.dataset.idx = taskIdx;
        checkbox.type = 'checkbox';
        checkbox.id = 'isDone';
        checkbox.classList.add('checkbox');
        checkbox.checked = task.isDone;
        const checkMark = document.createElement('span');
        checkMark.classList.add('checkMark');
        checkboxContainer.append(checkbox, checkMark);
        document.querySelector('.focusTask input[type = "range"]').disabled = task.isDone;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('todoDeleteBtns')
        deleteBtn.textContent = 'X' 
        deleteBtn.dataset.idx = taskIdx;

        const nextBtn = document.createElement('button');
        nextBtn.classList.add('nextBtn');
        nextBtn.dataset.idx = taskIdx;
        nextBtn.innerHTML = '&#x27A1;'
        wrapper.append(checkboxContainer, deleteBtn, nextBtn)
        focusTask.append(wrapper);
    }

    // Add todo Task form

    const taskFormWrapper = document.createElement('div');
    taskFormWrapper.classList.add('taskFormWrapper');

    const taskForm = document.createElement('form');
    taskForm.classList.add('taskForm');
    taskForm.id = 'taskForm';
  
    const taskLegend = document.createElement('legend');
    taskLegend.textContent = 'New Task:'
    taskForm.append(taskLegend);

    createInput('text','Title: ','title', taskForm);
    createInput('text','Description: ','desc', taskForm);
    createInput('date','Due Date: ','date', taskForm);
    createInput('range','Priority: ','prio', taskForm);
    createInput('submit','','submit', taskForm, 'save');

    taskFormWrapper.append(taskForm)
    main.append(taskFormWrapper);

    const addRangeInputAttrs = function(selector){
        const prioInp = document.querySelector(selector);
        prioInp.min = '1';
        prioInp.max = '3';
        prioInp.step = '1';
    }

    addRangeInputAttrs('#prio');

    

    return {
        initializeUI,
        updateProjectSidebar,
        updateTodoView,
        updateFocusTask
    }
}