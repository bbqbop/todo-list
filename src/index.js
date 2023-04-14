export const projectList = {
    list: [],
    erase: function(idx){
        this.list.splice(idx,1);
    }
};

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
    projectIdx++;
    projectList.list.push(newProject);
    
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

const userInputs = (function(){
    document.addEventListener('submit', (e) => {
        e.preventDefault();
        if(e.target.id === 'itemForm') handleUserInput.newItem(e);
        if(e.target.id === 'projectForm') handleUserInput.newProject(e);
    });
})();

const handleUserInput = {
    newItem : function(e){
        const title = e.target[0].value;
        const desc = e.target[1].value;
        const dueDate = e.target[2].value;
        const prio = e.target[3].value;

        const newItem = new TodoItem(title, desc, dueDate, prio);

        defaultProject.addItem(newItem);
    },
    newProject : function(e){
        const newProject =  createProject(e.target[0].value);
    }
}



