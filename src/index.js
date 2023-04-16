import initializeUI from './ui';

export { exportList, findCurrentProject, findCurrentItem }

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

const findCurrentItem = function() {
    const currentProject = findCurrentProject();
    const currentItem = currentProject.todoList.find( item => {
        item.isCurrentItem === true;
    })
}

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
            const titleBtns = document.querySelectorAll('.todoTitleBtns');
            titleBtns.forEach( button => {
                button.addEventListener('click', (e) => {
                    findCurrentProject().focusItem(e.target.dataset.idx);
                })
            })

            const deleteBtns = document.querySelectorAll('.todoDeleteBtns');
            deleteBtns.forEach( button => {
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
            ui.updateFocusItem();
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
    this.isCurrentItem;
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
    },
    focusItem: function(idx){
        this.todoList.forEach( item => {
            // console.log(this.todoList, idx)
            item === this.todoList[idx] 
                ? item.isCurrentItem = true
                : item.isCurrentItem = false
        });
        console.log(this.todoList)
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

        findCurrentProject().addItem(item)
    },
    newProject : function(e){
        const newProject =  createProject(e.target[0].value);
    }, 
    eraseItem : function(e){
        const idx = e.target.dataset.idx;

        findCurrentProject().removeItem(idx);
    }
}

ui.updateTodoView();



