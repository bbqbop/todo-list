import { exportList as projects, findCurrentProject, findCurrentItem } from "./index.js";

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
    createInput('submit','','submit', itemForm, 'save');

    ItemFormWrapper.append(itemForm)
    content.append(ItemFormWrapper);

    const addRangeInputAttrs = function(selector){
        const prioInp = document.querySelector(selector);
        prioInp.min = '1';
        prioInp.max = '3';
        prioInp.step = '1';
    }

    addRangeInputAttrs('#prio');

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
    createInput('submit','','submit', projectForm, 'safe');

    projectFormWrapper.append(projectForm);

    content.append(projectFormWrapper);

    
    // Dynamic objects:
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
   
    const todoView = document.createElement('div')
    todoView.classList.add('todoView');
    content.append(todoView); 

    const updateTodoView = function() {
        todoView.innerHTML = '';
        const currentProject = findCurrentProject();

        if (!currentProject) return;

        for (let item of currentProject.todoList) {
            const itemIdx = currentProject.todoList.indexOf(item)

            const div = document.createElement('div');
            div.classList.add('todos');
            div.dataset.idx = itemIdx;

            const title = document.createElement('button');
            title.classList.add('todoTitleBtns')
            title.textContent = item.title;
            title.dataset.idx = itemIdx;

            const priority = document.createElement('div');
            if (item.isDone) priority.style.backgroundColor = 'green';
            else if (item.prio == 1) priority.style.backgroundColor = 'yellow';
            else if (item.prio == 2) priority.style.backgroundColor = 'orange';
            else if (item.prio == 3) priority.style.backgroundColor = 'red';

            const checkbox = document.createElement('input');
            checkbox.dataset.idx = itemIdx;
            checkbox.type = 'checkbox';
            checkbox.id = 'isDone';
            checkbox.checked = item.isDone;

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('todoDeleteBtns')
            deleteBtn.textContent = 'X' 
            deleteBtn.dataset.idx = itemIdx;

            div.append(title, priority, checkbox, deleteBtn);
            todoView.append(div);
        }
    }

    // Focussed Item 

    const focusItem = document.createElement('div');
    focusItem.classList.add('focusItem');
    content.append(focusItem);

    const updateFocusItem = function() {
        focusItem.innerHTML = '';
        const currentItem = findCurrentItem();
        const currentProject = findCurrentProject();
        
        if (!currentItem) return;

        const itemIdx = currentProject.todoList.indexOf(currentItem);

        const projectTitle = document.createElement('h1');
        projectTitle.textContent = currentProject.title;

        const projectLen = document.createElement('p');
        projectLen.textContent = `${itemIdx + 1}/${currentProject.todoList.length}`

        focusItem.append(projectTitle, projectLen);
        // (type, labelText, name, parentElement, value, dataIdx)
        createInput('text','', 'title', focusItem, currentItem.title, itemIdx);
        createInput('text','', 'desc', focusItem, currentItem.desc, itemIdx);
        createInput('date','', 'dueDate', focusItem, currentItem.dueDate, itemIdx);
        createInput('range','Priority: ' ,'prio', focusItem, currentItem.prio, itemIdx)
        createInput('checkbox','Done', 'isDone', focusItem, currentItem.isDone, itemIdx);
        addRangeInputAttrs('.focusItem #prio');

        const checkbox = document.querySelector('.focusItem input[type = "checkbox"]')
        checkbox.checked = currentItem.isDone;
        document.querySelector('.focusItem input[type = "range"]').disabled = currentItem.isDone;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('todoDeleteBtns')
        deleteBtn.textContent = 'X' 
        deleteBtn.dataset.idx = itemIdx;

        const nextBtn = document.createElement('button');
        nextBtn.classList.add('nextBtn');
        nextBtn.dataset.idx = itemIdx;
        nextBtn.innerHTML = '&#x27A1;'
        focusItem.append(deleteBtn, nextBtn);

        if ( currentItem.isDone ) {
            focusItem.style.backgroundColor = 'green';
        }
        else {
            switch (parseInt(currentItem.prio)){
                case 1 : 
                    focusItem.style.backgroundColor = 'yellow';
                    break;
                case 2 : 
                    focusItem.style.backgroundColor = 'orange';
                    break;
                case 3 : 
                    focusItem.style.backgroundColor = 'red';
                    break;
            }
        }
    }

    

    return {
        initializeUI,
        updateProjectSidebar,
        updateTodoView,
        updateFocusItem
    }
}