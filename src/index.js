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
    if (!currentProject) return;
    const currentItem = currentProject.todoList.find( item => {
        return item.isCurrentItem === true;
    })
    return currentItem;
}

const ui = initializeUI();

// USER INPUTS

const UIController = (function eventListeners(){
    document.addEventListener('submit', (e) => {
        e.preventDefault();
        if(e.target.id === 'itemForm') handleUserInput.createItem(e);
        if(e.target.id === 'projectForm') handleUserInput.createProject(e);
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.reset();
        })
    });
    return {
        addProjectListener: function() {
            const deleteBtns = document.querySelectorAll('.projects button ~ button');
            deleteBtns.forEach(button => {
                button.removeEventListener('click', (e) => handleUserInput.deleteProject(e))
                button.addEventListener('click', (e) => handleUserInput.deleteProject(e))
            })
            
            const projectBtns = document.querySelectorAll('.projects button:first-child');
            projectBtns.forEach(button => {
                button.removeEventListener('click', (e) => handleUserInput.focusProject(e))
                button.addEventListener('click', (e) => handleUserInput.focusProject(e))
            })
        },
        addTodoListener: function() {
            const deleteBtns = document.querySelectorAll('.todoDeleteBtns');
            deleteBtns.forEach( button => {
                button.removeEventListener('click', (e) => handleUserInput.deleteItem(e))
                button.addEventListener('click', (e) => handleUserInput.deleteItem(e))
            })

            const titleBtns = document.querySelectorAll('.todoTitleBtns');
            titleBtns.forEach( button => {
                button.addEventListener('click', (e) => handleUserInput.focusItem(e))
            })

            const checkboxes = document.querySelectorAll('.todoView input[type ="checkbox"');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => handleUserInput.updateItem(e))
            })

        },
        addFocusItemListener: function() {
            const inputs = document.querySelectorAll('.focusItem input');
            if (inputs.length === 0) return;
            inputs.forEach( input => {
                input.addEventListener('change', (e) => handleUserInput.updateItem(e))
            })

            const nextBtn = document.querySelector('.nextBtn');
            if (!nextBtn) return;
            nextBtn.addEventListener('click', (e) => {
                const currentIdx = handleUserInput.getIdx(e);
                const newIdx = currentIdx + 1;
                handleUserInput.focusItem(newIdx)
            })
        },
        update: function() {
            ui.updateProjectSidebar();
            ui.updateTodoView();
            ui.updateFocusItem();
            this.addProjectListener();
            this.addTodoListener();
            this.addFocusItemListener();
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
        this.focusItem(this.todoList.indexOf(item))
    },
    removeItem: function(idx){
        this.todoList.splice(idx,1);
        UIController.update();
    },
    focusItem: function(idx){
        if (this.todoList[idx] === undefined){
            idx = 0;
        }
        this.todoList.forEach( item => {
            item === this.todoList[idx] 
                ? item.isCurrentItem = true
                : item.isCurrentItem = false
        });
        UIController.update();
    }
}

const defaultProject = createProject('myTodoList');

const handleUserInput = {
    createItem : function(e){
        const title = e.target[0].value;
        const desc = e.target[1].value;
        const dueDate = e.target[2].value;
        const prio = e.target[3].value;

        const item = new TodoItem(title, desc, dueDate, prio);

        let currentProject = findCurrentProject();

        if(!currentProject){
            currentProject = createProject('myTodoList');
        }
        currentProject.addItem(item);
    },
    updateItem : function(e) {
        const idx = this.getIdx(e);
        const currentItem = findCurrentProject().todoList[idx];
        const targetProperty = e.target.id;

        if (targetProperty === 'isDone'){
            currentItem.isDone = e.target.checked;
        }
        else {
            currentItem[targetProperty] = e.target.value;
        }
        UIController.update();
    },
    deleteItem : function(e){
        const idx = this.getIdx(e);
        const currentProject = findCurrentProject();
        currentProject.focusItem(idx-1 ? idx-1 : 0);
        currentProject.removeItem(idx);
    },
    focusItem : function(e){
        const idx = Number.isInteger(e) ? e : this.getIdx(e);
        findCurrentProject().focusItem(idx);
    },
    createProject : function(e){
        const createProject =  createProject(e.target[0].value);
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

ui.updateTodoView();



