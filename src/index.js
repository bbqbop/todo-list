import initializeUI from './ui';
import css from './style.css';

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
        if(e.target.id === 'taskForm') handleUserInput.createTask(e);
        if(e.target.id === 'projectForm') handleUserInput.createProject(e);
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.reset();
            form.style.display = 'none'
        })
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

            const addProjectBtn = document.querySelector('.addProjectBtn');
            addProjectBtn.addEventListener('click', () => {
                const projectForm = document.querySelector('.projectForm');
                projectForm.style.display = 'block'
                const firstInput = document.querySelector('.projectForm input');
                firstInput.focus();
                this.update();
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
            console.log(checkboxes)
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => handleUserInput.updateTask(e))
            })

            const addTaskBtn = document.querySelector('.addTaskBtn');
            addTaskBtn.addEventListener('click', () => {
                const taskForm = document.querySelector('.taskForm');
                taskForm.style.display = 'block'
                const firstInput = document.querySelector('.taskForm input');
                firstInput.focus();
                this.update();
            })
        },
        addFocusTaskListener: function() {
            const inputs = document.querySelectorAll('.focusTask input');
            if (inputs.length === 0) return;
            inputs.forEach( input => {
                input.addEventListener('change', (e) => handleUserInput.updateTask(e))
            })

            const nextBtn = document.querySelector('.nextBtn');
            if (!nextBtn) return;
            nextBtn.addEventListener('click', (e) => {
                const currentIdx = handleUserInput.getIdx(e);
                const newIdx = currentIdx + 1;
                handleUserInput.focusTask(newIdx)
            })
        },
        update: function() {
            ui.updateProjectSidebar();
            ui.updateTodoView();
            ui.updateFocusTask();
            this.addProjectListener();
            this.addTaskListener();
            this.addFocusTaskListener();
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
        const idx = this.getIdx(e);
        const currentProject = findCurrentProject();
        currentProject.focusTask(idx-1 ? idx-1 : 0);
        currentProject.removeTask(idx);
    },
    focusTask : function(e){
        const idx = Number.isInteger(e) ? e : this.getIdx(e);
        findCurrentProject().focusTask(idx);
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
    getIdx : function(e){
        return parseInt(e.target.dataset.idx);
    }
}

UIController.update();



