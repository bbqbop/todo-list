import initializeUI from './ui';
import css from './style.css';
import { iconPlus, iconMinus, iconEnter } from "./icons.js";

export { projects }

const ui = initializeUI();

const projects = {
    list: [],
    erase: function(idx) {
        this.list.splice(idx, 1);
        UIController.update();
    },
    focus: function(idx) {
        this.list.forEach( entry => {
            entry === this.list[idx]
            ? entry.isCurrentProject = true
            : entry.isCurrentProject = false;
        })
        UIController.update();
    }, 
    findCurrentProject : function() {
        const currentProject = this.list.find( project => {
            return project.isCurrentProject === true;
        })
        return currentProject;
    },
    findCurrentTask : function() {
        const currentProject = this.findCurrentProject();
        if (!currentProject) return;
        const currentTask = currentProject.todoList.find( task => {
            return task.isCurrentTask === true;
        })
        return currentTask;
    },
};

// USER INPUTS

const UIController = (function eventListeners(){
    document.addEventListener('submit', (e) => {
        e.preventDefault();
        if(e.target.id === 'taskForm') {
            handleUserInput.createTask(e);
            handleUserInput.toggleForm('task')
        }
        if(e.target.id === 'projectForm') {
            handleUserInput.createProject(e);
            handleUserInput.toggleForm('project')
        }
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset())
    });

    const addProjectBtn = document.querySelector('.addProjectBtn');
    addProjectBtn.addEventListener('click', (e) => {
        if (handleUserInput.isFormOpen) return;
        handleUserInput.toggleForm('project');
    });

    const addTaskBtn = document.querySelector('.addTaskBtn');
    addTaskBtn.addEventListener('click', () => {
        if (handleUserInput.isFormOpen) return;
        handleUserInput.toggleForm('task');
    });

    const closeFormBtn = document.querySelectorAll('.closeBtn');
    closeFormBtn.forEach(button => {
        button.addEventListener('click', (e)=> {
        handleUserInput.toggleForm(e.target.id);
        })
    });
    const taskCloseBtn = document.createElement('button');
    taskCloseBtn.classList.add('closeBtn');
    taskCloseBtn.id = 'task'
    taskCloseBtn.textContent = 'X';
    document.addEventListener('keydown', (e) => {
        if (e.key === " " && !handleUserInput.isFormOpen){
            handleUserInput.toggleForm('task');
        }
        if (e.key === 'Escape' && handleUserInput.isFormOpen){
            handleUserInput.toggleForm(handleUserInput.openForm)
        }
        if (e.key === "ArrowRight" || e.key === "ArrowDown"){
            handleUserInput.focusNextTask();
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp"){
            handleUserInput.focusPrevTask();
        }
        if (e.key === "Backspace" && !handleUserInput.isFormOpen){
            const taskIdx = projects.findCurrentProject().todoList.indexOf(findCurrentTask());
            handleUserInput.deleteTask(taskIdx); 
        }   
    });

    return {
        addProjectListener: function() {
            const deleteBtns = document.querySelectorAll('.projects button ~ button');
            deleteBtns.forEach(button => {
                button.removeEventListener('click', (e) => handleUserInput.deleteProject(e))
                button.addEventListener('click', (e) => handleUserInput.deleteProject(e))
            })
            
            const projectBtns = document.querySelectorAll('.projects');
            projectBtns.forEach(button => {
                button.removeEventListener('click', (e) => handleUserInput.focusProject(e))
                button.addEventListener('click', (e) => handleUserInput.focusProject(e))
            })
        },
        addTaskListener: function() {
            const deleteBtns = document.querySelectorAll('.todoDeleteBtns');
            deleteBtns.forEach( button => {
                button.removeEventListener('click', (e) => handleUserInput.deleteTask(e))
                button.addEventListener('click', (e) => handleUserInput.deleteTask(e))
            })

            const titleBtns = document.querySelectorAll('.todos button:first-of-type');
            titleBtns.forEach( button => {
                button.addEventListener('click', (e) => handleUserInput.focusTask(e))
            })

            const checkboxes = document.querySelectorAll('.todos input[type ="checkbox"');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => handleUserInput.updateTask(e))
            })
        },
        addFocusTaskListener: function() {
            const inputs = document.querySelectorAll('.focusTask input');
            if (inputs.length === 0) return;
            inputs.forEach( input => {
                input.addEventListener('change', (e) => {
                    handleUserInput.updateTask(e)
                })
            });

            const nextBtn = document.querySelector('.nextBtn');
            if (!nextBtn) return;
            nextBtn.addEventListener('click', () => {
                handleUserInput.focusNextTask();
            })
        },
        update: function() {
            populateStorage();
            ui.update();
            this.addProjectListener();
            this.addTaskListener();
            this.addFocusTaskListener();
            const focusTask = document.querySelector('.focusTask');
            if (!projects.findCurrentTask()){
                focusTask.style.display = 'none';
            }
            else {
                focusTask.style.display = 'block';
            }
        },
    }
})();

const Task = function(title, desc, dueDate, prio){
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.prio = prio;
    this.isDone = false;
    this.isCurrentTask;
};

const Project = function(title){
    let newProject = Object.create(Project.prototype);
    newProject.todoList = [];
    newProject.title = title;
    newProject.isCurrentProject;
    projects.list.push(newProject);
    projects.focus(projects.list.indexOf(newProject));
    
    return newProject;
}
    
Project.prototype = {
    addTask: function(task){
        this.todoList.push(task);
        this.focusTask(this.todoList.indexOf(task))
    },
    removeTask: function(idx){
        this.todoList.splice(idx,1);
        UIController.update();
    },
    focusTask: function(idx){
        if (this.todoList[idx] === undefined){
            idx = 0;
        }
        this.todoList.forEach( task => {
            task === this.todoList[idx] 
                ? task.isCurrentTask = true
                : task.isCurrentTask = false
        });
        UIController.update();
    }
}

const handleUserInput = {
    createTask : function(e){
        const title = e.target[0].value;
        const desc = e.target[1].value;
        const dueDate = e.target[2].value;
        const prio = e.target[3].value;

        const task = new Task(title, desc, dueDate, prio);

        let currentProject = projects.findCurrentProject();

        if(!currentProject){
            currentProject = Project('myTodoList');
        }
        currentProject.addTask(task);
    },
    updateTask : function(e) {
        const idx = this.getIdx(e);
        const currentTask = projects.findCurrentProject().todoList[idx];
        const targetProperty = e.target.id;

        if (targetProperty === 'isDone'){
            currentTask.isDone = e.target.checked;
        }
        else {
            currentTask[targetProperty] = e.target.value;
        }
        UIController.update();
    },
    deleteTask : function(e){
        const idx = Number.isInteger(e) ? e : this.getIdx(e);
        const currentProject = projects.findCurrentProject();
        currentProject.focusTask(idx-1 ? idx-1 : 0);
        currentProject.removeTask(idx);
    },
    focusTask : function(e){
        const idx = Number.isInteger(e) ? e : this.getIdx(e);
        projects.findCurrentProject().focusTask(idx);
        const firstInput = document.querySelector(`.focusTask input`);
        firstInput.focus();
    },
    focusNextTask : function(){
        const currentProject = projects.findCurrentProject()
        const currentIdx = currentProject.todoList.indexOf(projects.findCurrentTask());
        const newIdx = currentIdx + 1;
        this.focusTask(newIdx)
    },
    focusPrevTask : function(){
        const currentProject = projects.findCurrentProject()
        const currentIdx = currentProject.todoList.indexOf(projects.findCurrentTask());
        const newIdx = currentIdx - 1;
        this.focusTask(newIdx)
    },
    createProject : function(e){
        const createProject =  Project(e.target[0].value);
    }, 
    deleteProject : function(e){
        projects.erase(this.getIdx(e));
    }, 
    focusProject : function(e){
        projects.focus(this.getIdx(e));
    }, 
    toggleForm : function(target) {
        const form = document.querySelector(`.${target}FormWrapper`);
        form.classList.toggle('toggleForm')
        const firstInput = document.querySelector(`.${target}Form input`);
        firstInput.focus();
        this.isFormOpen = !this.isFormOpen;
        this.openForm = this.isFormOpen ? target : false;
        this.toggleBtn(target);
        this.toggleBlur(target);
    },
    toggleBtn : function(target) {
        target = target[0].toUpperCase() + target.slice(1);
        const btn = document.querySelector(`.add${target}Btn`)

        if (target === 'Task'){
            if (this.isFormOpen){
                const minus = iconMinus.cloneNode(true);
                btn.textContent = '';
                btn.append(minus);
            }
            else {
                btn.textContent = '+ add new task (space)'
            }
        }
        else {
            if (btn.firstChild !== iconMinus){
                btn.textContent = '';
                btn.append(iconMinus);
            } 
            else { 
                btn.textContent = '';
                btn.append(iconPlus);
            } 
    }
    },
    toggleBlur : function(target) {
        if (target === 'task'){
            const elementsToBlur = document.querySelectorAll('.todoView, .focusTask, .projectSidebar');
            elementsToBlur.forEach(element => element.classList.toggle('blur'));
        }
        else {
            const elementsToBlur = document.querySelector('.main');
            elementsToBlur.classList.toggle('blur');
        }
    },
    getIdx : function(e){
        return parseInt(e.target.dataset.idx);
    },
    isFormOpen : false,
    openForm : false
}


if (!window.localStorage.getItem('projectList')){
    const defaultProject = Project('myProject');
    populateStorage();
} else {
    setProjectsList();
};

function populateStorage() {
    localStorage.setItem('projectList', JSON.stringify(projects.list))
};

function setProjectsList() {
    const userData = localStorage.getItem('projectList')
    const parsedData = JSON.parse(userData);

    parsedData.forEach( project => {
        project = Object.assign(project, Project.prototype)
    })
    projects.list = parsedData;
    UIController.update()
}