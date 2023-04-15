import initializeUI from './ui';

export const projectList = {
    list: [],
    erase: function(idx) {
        this.list.splice(this.findIdx(idx), 1);
    },
    focus: function(idx) {
        this.list.forEach( entry => {
            entry.isCurrentProject = false;
        })
        this.list[this.findIdx(idx)].isCurrentProject = true;
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

const ui = initializeUI();

// USER INPUTS

const UIController = (function eventListeners(){
    document.addEventListener('submit', (e) => {
        e.preventDefault();
        if(e.target.id === 'itemForm') handleUserInput.newItem(e);
        if(e.target.id === 'projectForm') handleUserInput.newProject(e);
    });
    return {
        addListener: function() {
            const deleteBtns = document.querySelectorAll('.projects button ~ button');
            deleteBtns.forEach(button => {
                button.addEventListener('click', (e) => {
                    projectList.erase(e.target.dataset.idx);
                    this.update();
                })
            })
            
            const projectBtns = document.querySelectorAll('.projects button:first-child');
            projectBtns.forEach(button => {
                button.addEventListener('click', (e) => {
                    console.log('Project!')
                    projectList.focus(e.target.dataset.idx);
                })
            })
        },
        update: function() {
            ui.updateProjectSidebar();
            this.addListener();
        }

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
    newProject.isCurrentProject = true;
    projectIdx++;
    projectList.list.push(newProject);
    UIController.update();
    
    return newProject;
}
    
createProject.prototype = {
    addItem: function(item){
        this.todoList.push(item);
    },
    removeItem: function(idx){
        this.todoList.splice(idx,1);
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

        projectList.list.forEach(project => {
            if (project.isCurrentProject === true){
                project.addItem(item);
            }
        })
        console.log('ITEM ADDED', projectList);
    },
    newProject : function(e){
        const newProject =  createProject(e.target[0].value);
    }
}









