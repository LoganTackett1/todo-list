import css from "./index.css";
import todo from "./todo.js";
import {domInit} from './dom.js';

const content = document.createElement('div');
content.classList.add("content");

document.body.appendChild(content);

const header = document.createElement('div');
header.classList.add("header");
const sideBar = document.createElement('div');
sideBar.classList.add("side-bar");
sideBar.id = "side-bar";
const container = document.createElement('div');
container.classList.add("container");
container.id = "container";

content.appendChild(header);
content.appendChild(sideBar);
content.appendChild(container);

header.textContent = "Todo List";

const sideBarTitle = document.createElement('h1');
sideBarTitle.textContent = "Projects";
const projectContainer = document.createElement('div');
projectContainer.classList.add('project-container');
const newProjBtn = document.createElement('button');
newProjBtn.classList.add('new-project');
newProjBtn.textContent = "+ New Project";

sideBar.appendChild(sideBarTitle);
sideBar.appendChild(projectContainer);
sideBar.appendChild(newProjBtn);

domInit();



