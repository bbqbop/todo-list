import { exportList as projects } from "./index.js";

export default function initializeUI(){
    const content = document.querySelector('.content');

    const createInput = function(type, text, name, parentElement){
        const label = document.createElement('legend');
        label.classList.add(name);
        label.textContent = text;
        const input = document.createElement('input');
        input.type = type;
        input.id = name
        label.append(input);
        parentElement.append(label);
    }

    // Add todo Item form

    const ItemFormWrapper = document.createElement('div');
    ItemFormWrapper.classList.add('ItemFormWrapper');

    const itemForm = document.createElement('form');
    itemForm.classList.add('itemForm');
    itemForm.id = 'itemForm'

    const itemLegend = document.createElement('legend');
    itemLegend.textContent = 'New Item:'
    itemForm.append(itemLegend);

    createInput('text','Title: ','title', itemForm);
    createInput('text','Description: ','desc', itemForm);
    createInput('date','Due Date: ','date', itemForm);
    createInput('range','Priority: ','prio', itemForm);
    createInput('submit','','submit', itemForm);

    ItemFormWrapper.append(itemForm)
    content.append(ItemFormWrapper);

        // range input properties:
    const prioInp = document.querySelector('#prio');
    prioInp.min = '1';
    prioInp.max = '3';
    prioInp.step = '1';
    prioInp.value = '2';


    // Add project form

    const projectFormWrapper = document.createElement('div');
    projectFormWrapper.classList.add('projectFormWrapper');

    const projectForm = document.createElement('form');
    projectForm.classList.add('projectForm');
    projectForm.id = 'projectForm';

    const projectLegend = document.createElement('legend');
    projectLegend.textContent = 'New Project:'
    projectForm.append(projectLegend);

    createInput('text', 'Title: ', 'title', projectForm)
    createInput('submit','','submit', projectForm);

    projectFormWrapper.append(projectForm);

    content.append(projectFormWrapper);

    // Project List

    const projectSidebar = document.createElement('div');
    projectSidebar.classList.add('projectSidebar');
    content.append(projectSidebar);

    const updateProjectSidebar = function(){
        projectSidebar.innerHTML = '';
        projects.forEach( project => {
            const div = document.createElement('div');
            div.classList.add('projects');

            const btn = document.createElement('button');
            btn.dataset.idx = project.idx;
            btn.textContent = project.title;
            
            const erase = document.createElement('button')
            erase.dataset.idx = project.idx;
            erase.textContent = 'X';
           
            div.append(btn, erase);
            projectSidebar.append(div);
        });  
    };

    // Todo items
   
    const todoDisplay = document.createElement('div')
    todoDisplay.classList.add('todoDisplay');
    content.append(todoDisplay); 

    const updateTodoView = function() {
        todoDisplay.innerHTML = '';
        const currentProject = projects.find( project => {
            return project.isCurrentProject === true;
        })
        if (!currentProject) return;

        for (let item of currentProject.todoList) {
            const div = document.createElement('div');
            div.classList.add('todos');
            div.dataset.idx = currentProject.idx;

            const title = document.createElement('div');
            title.textContent = item.title;

            const priority = document.createElement('div');
            if (item.prio == 1) priority.style.backgroundColor = 'green';
            if (item.prio == 2) priority.style.backgroundColor = 'yellow';
            if (item.prio == 3) priority.style.backgroundColor = 'red';

            div.append(title, priority);
            todoDisplay.append(div);
        }
    }

    

    return {
        initializeUI,
        updateProjectSidebar,
        updateTodoView
    }
}