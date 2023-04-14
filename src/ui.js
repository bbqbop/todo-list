import { projectList } from "./index.js";

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

// Form to add new todo Item

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


// Form to add new project

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

// Display Project List

const projectSidebar = document.createElement('div');
projectSidebar.classList.add('projectSidebar');

const updateProjectSidebar = function(){
    projectSidebar.innerHTML = '';
    // console.log(projectList);
    projectList.list.forEach(project => {
        const div = document.createElement('div');
        div.classList.add('projects');

        const btn = document.createElement('button');
        btn.dataset.idx = project.idx;
        btn.textContent = project.title;

        const erase = document.createElement('button')
        erase.dataset.idx = project.idx;
        erase.textContent = 'X';
        erase.addEventListener('click', (e) => {
            console.log(e)
        })

        div.append(btn, erase);
        projectSidebar.append(div);
    })
};

updateProjectSidebar();

const projectSubmit = document.querySelector('.projectForm #submit');
projectSubmit.addEventListener('click',() => {
    setTimeout(updateProjectSidebar, 350);
})

content.append(projectSidebar);