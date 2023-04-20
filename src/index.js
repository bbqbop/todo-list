import initializeUI from './ui';
import css from './style.css';
import { iconPlus, iconMinus, iconEnter } from "./icons.js";

export { exportList, findCurrentProject, findCurrentTask }

const projects = {
    list: [],
    erase: function(idx) {
        this.list.splice(this.findIdx(idx), 1);
        UIController.update();
    },
    focus: function(idx) {
        this.list.forEach( entry => {
            entry === this.list[this.findIdx(idx)]
            ? entry.isCurrentProject = true
            : entry.isCurrentProject = false;
        })
        UIController.update();
    }, 
    findIdx: function(idx) {
        let arrayIdx;
        this.list.forEach( entry => {
            if (idx == entry.idx){
                arrayIdx = this.list.indexOf(entry)
            }
        })
        return arrayIdx;
    },
};

const exportList = projects.list;

const findCurrentProject = function() {
    const currentProject = projects.list.find( project => {
        return project.isCurrentProject === true;
    })
    return currentProject;
};

const findCurrentTask = function() {
    const currentProject = findCurrentProject();
    if (!currentProject) return;
    const currentTask = currentProject.todoList.find( task => {
        return task.isCurrentTask === true;
    })
    return currentTask;
}

const ui = initializeUI();

// USER INPUTS

const UIController = (function eventListeners(){
    document.addEventListener('submit', (e) => {
        e.preventDefault();
        // handleUserInput.isFormOpen = !handleUserInput.isFormOpen;
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

    const closeFormBtn = document.querySelector('.closeBtn');
    closeFormBtn.addEventListener('click', (e)=> {
        handleUserInput.toggleForm(e.target.id);
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === " " && !handleUserInput.isFormOpen){
            handleUserInput.toggleForm('task');
        }
        if (e.key === "ArrowRight" || e.key === "ArrowDown"){
            handleUserInput.focusNextTask();
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp"){
            handleUserInput.focusPrevTask();
        }
        if (e.key === "Backspace"){
            const taskIdx = findCurrentProject().todoList.indexOf(findCurrentTask());
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
            ui.updateProjectSidebar();
            ui.updateTodoView();
            ui.updateFocusTask();
            this.addProjectListener();
            this.addTaskListener();
            this.addFocusTaskListener();
            const focusTask = document.querySelector('.focusTask');
            if (!findCurrentTask()){
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

let projectIdx = 0
const Project = function(title){
    let newProject = Object.create(Project.prototype);
    newProject.todoList = [];
    newProject.title = title;
    newProject.idx = projectIdx;
    newProject.isCurrentProject;
    projects.list.push(newProject);
    projects.focus(projectIdx);
    projectIdx++;
    
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

const defaultProject = Project('myTodoList');

const handleUserInput = {
    createTask : function(e){
        const title = e.target[0].value;
        const desc = e.target[1].value;
        const dueDate = e.target[2].value;
        const prio = e.target[3].value;

        const task = new Task(title, desc, dueDate, prio);

        let currentProject = findCurrentProject();

        if(!currentProject){
            currentProject = Project('myTodoList');
        }
        currentProject.addTask(task);
    },
    updateTask : function(e) {
        const idx = this.getIdx(e);
        const currentTask = findCurrentProject().todoList[idx];
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
        const currentProject = findCurrentProject();
        currentProject.focusTask(idx-1 ? idx-1 : 0);
        currentProject.removeTask(idx);
    },
    focusTask : function(e){
        const idx = Number.isInteger(e) ? e : this.getIdx(e);
        findCurrentProject().focusTask(idx);
        const firstInput = document.querySelector(`.focusTask input`);
        firstInput.focus();
    },
    focusNextTask : function(){
        const currentProject = findCurrentProject()
        const currentIdx = currentProject.todoList.indexOf(findCurrentTask());
        const newIdx = currentIdx + 1;
        this.focusTask(newIdx)
    },
    focusPrevTask : function(){
        const currentProject = findCurrentProject()
        const currentIdx = currentProject.todoList.indexOf(findCurrentTask());
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
}

UIController.update();


