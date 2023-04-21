import { projects } from "./index.js";
import { iconPlus, iconMinus, iconEnter, iconHamburger } from "./icons.js";

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
    
    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.classList.add('hamburgerBtn');
    hamburgerBtn.append(iconHamburger);

    const projectListWrapper = document.createElement('div');
    projectListWrapper.classList.add('projectListWrapper');

    const projectList = document.createElement('div');
    projectList.classList.add('projectList')
    // projectSidebar.append(logo, hamburgerBtn, projectList)
   
    const addProjectBtn = document.createElement('button');
    addProjectBtn.classList.add('addProjectBtn');
    addProjectBtn.append(iconPlus);

     // Add project form

     const projectFormWrapper = document.createElement('div');
     projectFormWrapper.classList.add('projectFormWrapper');

     const projectCloseBtn = document.createElement('button');
     projectCloseBtn.classList.add('closeBtn');
     projectCloseBtn.id = 'project'
     projectCloseBtn.textContent = 'X';
 
     const projectForm = document.createElement('form');
     projectForm.classList.add('projectForm');
     projectForm.id = 'projectForm';

     createInput('text', '', 'title', projectForm)
     const formSubmit = document.createElement('button');
     formSubmit.type = 'submit'
     formSubmit.id = 'submit';
     formSubmit.append(iconEnter);
     projectForm.append(formSubmit);   
     
     projectFormWrapper.append(projectCloseBtn, projectForm);
 
     projectListWrapper.append(projectList, addProjectBtn, projectFormWrapper);
     projectSidebar.append(logo, hamburgerBtn, projectListWrapper);


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
    
    // Focussed Task 

    const focusTask = document.createElement('div');
    focusTask.classList.add('focusTask');
    main.append(focusTask);

    // Add todo Task form

    const taskFormWrapper = document.createElement('div');
    taskFormWrapper.classList.add('taskFormWrapper');

    const taskCloseBtn = document.createElement('button');
    taskCloseBtn.classList.add('closeBtn');
    taskCloseBtn.id = 'task'
    taskCloseBtn.textContent = 'X';

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
    
    const taskSubmit = document.createElement('button');
    taskSubmit.type = 'submit'
    taskSubmit.id = 'submit';
    const iconEnterClone = iconEnter.cloneNode(true);
    taskSubmit.append(iconEnterClone);
    taskForm.append(taskSubmit); 

    taskFormWrapper.append(taskCloseBtn,taskForm)
    main.append(taskFormWrapper);

    const addRangeInputAttrs = function(selector){
        const prioInp = document.querySelector(selector);
        prioInp.min = '1';
        prioInp.max = '3';
        prioInp.step = '1';
    }

    addRangeInputAttrs('#prio');

    const update = function(){
        const currentProject = projects.findCurrentProject();
        const currentTask = projects.findCurrentTask();

        const updateProjectSidebar = function(){
            projectList.innerHTML = '';
            projects.list.forEach( project => {
                const idx = projects.list.indexOf(project);
                const div = document.createElement('div');
                div.classList.add('projects');
                div.dataset.idx = idx;
    
                const btn = document.createElement('button');
                btn.dataset.idx = idx;
                btn.textContent = project.title;
                
                const erase = document.createElement('button')
                erase.dataset.idx = idx;
                erase.textContent = 'X';
               
                div.append(btn, erase);
                
                projectList.append(div);
    
                if (project === currentProject){
                    btn.classList.add('active')
                }
            });  
        }();
        const updateTodoView = function() {
            todoView.innerHTML = '';
    
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
    
                if (task === currentTask){
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
        }();
        const updateFocusTask = function() {
            focusTask.innerHTML = '';
            
            if (!currentTask) {
                return;
            }
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
            createInput('range','Priority: ' ,'prio', focusTask, currentTask.prio, taskIdx);
    
            const priority = document.createElement('div');
            priority.classList.add('taskPriority')
            if (currentTask.isDone) priority.style.backgroundColor = 'green';
            else if (currentTask.prio == 1) priority.style.backgroundColor = 'yellow';
            else if (currentTask.prio == 2) priority.style.backgroundColor = 'orange';
            else if (currentTask.prio == 3) priority.style.backgroundColor = 'red';
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
            checkbox.checked = currentTask.isDone;
            const checkMark = document.createElement('span');
            checkMark.classList.add('checkMark');
            checkboxContainer.append(checkbox, checkMark);
            document.querySelector('.focusTask input[type = "range"]').disabled = task.isDone;
    
            const nextBtn = document.createElement('button');
            nextBtn.classList.add('nextBtn');
            nextBtn.dataset.idx = taskIdx;
            nextBtn.innerHTML = '&#x27A1;'
    
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('todoDeleteBtns')
            deleteBtn.textContent = 'X' 
            deleteBtn.dataset.idx = taskIdx;
    
            wrapper.append(checkboxContainer, nextBtn, deleteBtn)
            focusTask.append(wrapper);
        }();
    };
    

    return {
        initializeUI,
        update
    }
}