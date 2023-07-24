import {todoInit, tdProject, tdProjects, tdTask} from './todo.js';
import css from './dom.css';

export function domInit () {
    const projectObject = todoInit();
    console.log(projectObject);
    const selectedInit = projectObject.selected;
    for (let project of projectObject.list) {
        domProject(project);
    }

    const newProjBtn = document.getElementsByClassName('new-project');

    newProjBtn[0].addEventListener('click', () => {
        projectForm(projectObject);
    });

    if (selectedInit != null) {
        const current = projectObject.getProjById(selectedInit);
        if (current != null) {
            domSelect(current);
        }
    }
}

function domProject (project) {
    const element = document.createElement('div');
    element.id = project.id;
    element.classList.add('project');
    
    const title = document.createElement('h2');
    title.textContent = project.title;
    const rmBtn = document.createElement('button');
    rmBtn.textContent = "X";
    rmBtn.onclick = () => {
        if (project.parent.selected == project.id) {
            project.parent.selected = null;
            const taskContainer = document.getElementsByClassName('container');

            for (let child of Array.from(taskContainer[0].children)) {
                child.remove();
            }
        }
        project.rmSelf();
        element.remove();
    }

    element.appendChild(title);
    element.appendChild(rmBtn);

    const projectContainer = document.getElementsByClassName('project-container');

    projectContainer[0].appendChild(element);

    title.onclick = function () {
        domSelect(project);
    }

    domSelect(project);
}

function domSelect(project) {
    project.parent.setSelected(project);
    const taskContainer = document.getElementsByClassName('container');

    for (let child of Array.from(taskContainer[0].children)) {
        child.remove();
    }

    const newTaskBtn = document.createElement('button');
    newTaskBtn.textContent = "+ New Task";
    newTaskBtn.onclick = () => {
        taskForm(project);
    }
    taskContainer[0].appendChild(newTaskBtn);

    for (let task of project.tasks) {
        const taskElement = domTask(task);
        taskContainer[0].appendChild(taskElement);
    }

    const projectContainer = document.getElementsByClassName("project-container");

    for (let e of Array.from(projectContainer[0].children)) {
        e.classList.remove("selected");
    }
    const projectElement = document.getElementById(project.id);
    projectElement.classList.add("selected");
}

function domTask (task) {
    const element = document.createElement('div');
    element.id = task.id;
    element.classList.add('task');
    
    const title = document.createElement('h2');
    title.textContent = task.title;
    const description = document.createElement('span');
    description.textContent = task.description;
    const dueDate = document.createElement('span');
    dueDate.textContent = task.dueDate;
    const priority = document.createElement('span');
    priority.textContent = task.priority;

    element.appendChild(title);
    element.appendChild(description);
    element.appendChild(dueDate);
    element.appendChild(priority);

    const rmBtn = document.createElement('button');
    rmBtn.textContent = "X";

    rmBtn.onclick = () => {
        task.rmSelf();
        task.parent.parent.selected = null;
        element.remove();
    }
    element.appendChild(rmBtn);

    return element;
}

function projectForm (mainObj) {
    const form = document.createElement('form');
    form.innerHTML = `
    <div>
        <label for="title">Title:</label>
        <input name="title" id="title" required></input>
    </div>
    <div>
        <button type="submit">Create</button>
        <button type="button" id="cancel">Cancel</button>
    </div>
    `;
    form.classList.add('project-form');

    const sideBar = document.getElementById("side-bar");
    sideBar.removeChild(sideBar.lastChild);
    sideBar.appendChild(form);

    form.addEventListener('submit', e => {
        e.preventDefault();

        let title = document.getElementById("title");
        const tempProject = new tdProject(title.value);
        mainObj.addProject(tempProject);
        domProject(tempProject);

        newProjectButton(mainObj);
        form.remove();
    });

    const cancel = document.getElementById("cancel");
    cancel.addEventListener('click', () => {
        newProjectButton(mainObj);
        form.remove();
    });
}

function newProjectButton (obj) {
    const newProjBtn = document.createElement('button');
    newProjBtn.classList.add('new-project');
    newProjBtn.textContent = "+ New Project";
    const sideBar = document.getElementById("side-bar");
    sideBar.appendChild(newProjBtn);
    newProjBtn.addEventListener('click', () => {
        projectForm(obj);
    });
}

function taskForm (project) {
    const form = document.createElement('form');
    form.innerHTML = `
    <div>
        <label for="Ttitle">Title:</label>
        <input name="Ttitle" id="Ttitle" required></input>
        <label for="Tdescription">Description:</label>
        <input name="Tdescription" id="Tdescription" required></input>
        <label for="TdueDate">Due Date:</label>
        <input name="TdueDate" id="TdueDate" required></input>
        <label for="Tpriority">Priority:</label>
        <input name="Tpriority" id="Tpriority" required></input>
    </div>
    <div>
        <button type="submit">Create</button>
        <button type="button" id="t-cancel">Cancel</button>
    </div>
    `;
    form.classList.add('task-form');

    const container = document.getElementById("container");
    container.removeChild(container.firstChild);
    container.insertBefore(form,container.firstChild);

    form.addEventListener('submit', e => {
        e.preventDefault();

        let title = document.getElementById("Ttitle");
        let description = document.getElementById("Tdescription");
        let dueDate = document.getElementById("TdueDate");
        let priority = document.getElementById("Tpriority");
        const tempTask = new tdTask(title.value,description.value,dueDate.value,priority.value);
        project.addTask(tempTask);
        const element = domTask(tempTask);
        container.appendChild(element);

        newTaskButton(project);
        form.remove();
    });

    const cancel = document.getElementById("t-cancel");
    cancel.addEventListener('click', () => {
        newTaskButton(project);
        form.remove();
    });
}

function newTaskButton (obj) {
    const newTaskBtn = document.createElement('button');
    newTaskBtn.textContent = "+ New Task";
    newTaskBtn.onclick = () => {
        taskForm(obj);
    }
    const container = document.getElementById("container");
    container.insertBefore(newTaskBtn,container.firstChild);
}

