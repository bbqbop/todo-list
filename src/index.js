import initializeUI from './ui';

export { exportList }

const projects = {
    list: [],
    erase: function(idx) {
        this.list.splice(this.findIdx(idx), 1);
        UIController.update();
    },
    focus: function(idx) {
        this.list.forEach( entry => {
            entry.isCurrentProject = false;
        })
        this.list[this.findIdx(idx)].isCurrentProject = true;
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

const ui = initializeUI();

// USER INPUTS

const UIController = (function eventListeners(){
    document.addEventListener('submit', (e) => {
        e.preventDefault();
        if(e.target.id === 'itemForm') handleUserInput.newItem(e);
        if(e.target.id === 'projectForm') handleUserInput.newProject(e);
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.reset();
        })
    });
    return {
        addProjectListener: function() {
            const deleteBtns = document.querySelectorAll('.projects button ~ button');
            deleteBtns.forEach(button => {
                button.removeEventListener('click', (e) => {
                    projects.erase(e.target.dataset.idx);
                })
                button.addEventListener('click', (e) => {
                    projects.erase(e.target.dataset.idx);
                })
            })
            
            const projectBtns = document.querySelectorAll('.projects button:first-child');
            projectBtns.forEach(button => {
                button.removeEventListener('click', (e) => {
                    projects.focus(e.target.dataset.idx);
                })
                button.addEventListener('click', (e) => {
                    projects.focus(e.target.dataset.idx);
                })
            })
        },
        addTodoListener: function() {
            const deleteBtns = document.querySelectorAll('.todoDeleteBtns');
            deleteBtns.forEach(button => {
                button.removeEventListener('click', (e) => {
                    handleUserInput.eraseItem(e);
                })
                button.addEventListener('click', (e) => {
                    handleUserInput.eraseItem(e);
                })
            })
        },
        update: function() {
            ui.updateProjectSidebar();
            ui.updateTodoView();
            this.addProjectListener();
            this.addTodoListener();
        },
    }
})();

const TodoItem = function(title, desc, dueDate, prio){
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.prio = prio;
    this.isDone = false;
};

let projectIdx = 0
const createProject = function(title){
    let newProject = Object.create(createProject.prototype);
    newProject.todoList = [];
    newProject.title = title;
    newProject.idx = projectIdx;
    newProject.isCurrentProject;
    projects.list.push(newProject);
    projects.focus(projectIdx);
    projectIdx++;
    
    return newProject;
}
    
createProject.prototype = {
    addItem: function(item){
        this.todoList.push(item);
        UIController.update();
    },
    removeItem: function(idx){
        this.todoList.splice(idx,1);
        UIController.update();
    }
}

const defaultProject = createProject('myTodoList');

const handleUserInput = {
    newItem : function(e){
        const title = e.target[0].value;
        const desc = e.target[1].value;
        const dueDate = e.target[2].value;
        const prio = e.target[3].value;

        const item = new TodoItem(title, desc, dueDate, prio);

        this.findCurrentProject().addItem(item)
    },
    newProject : function(e){
        const newProject =  createProject(e.target[0].value);
    }, 
    eraseItem : function(e){
        const idx = e.target.dataset.idx;

        this.findCurrentProject().removeItem(idx);

    },
    findCurrentProject : function(e){
        const currentProject = projects.list.find( project => {
            return project.isCurrentProject === true;
        })
        return currentProject;
    }
}

ui.updateTodoView();



