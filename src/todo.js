function makeId () {
        const selection = [0,1,2,3,4,5,6,7,8,9];
        let result = "";
        for (let i = 0; i<10; i++) {
            result = result + `${selection[Math.floor(Math.random()*selection.length)]}`;
        }
        return result;
}

function saveState (object) {
    let projectList = [];

    for (let project of object.list) {
        const taskArray = [];

        for (let task of project.tasks) {
            taskArray.push({
                title : task.title,
                description : task.description,
                id : task.id,
                priority : task.priority,
                dueDate : task.dueDate
            });
        }

        projectList.push({
            title : project.title,
            tasks : taskArray,
            id : project.id
        });

    }

    let tempSelected;
    if (object.selected == null) {
        tempSelected = null;
    } else {
        tempSelected = object.selected;
    }

    let state = {
        selected : tempSelected,
        list : projectList
    };

    let data = JSON.stringify(state);
    localStorage.setItem('todo',data);
}

function getState () {
    const data = JSON.parse(localStorage.getItem('todo'));

    const proObj = new tdProjects();

    proObj.selected = data.selected;

    for (let project of data.list) {
        const temp = new tdProject(project.title);
        temp.id = project.id;
        proObj.addProject(temp);

        for (let task of project.tasks) {
            const tsk = new tdTask(task.title,task.description,task.dueDate,task.priority);
            tsk.id = task.id;
            temp.addTask(tsk);
        }
    }
    return proObj;
}

export class tdProject {
    constructor (title) {
        this.title = title,
        this.tasks = [],
        this.parent = null,
        this.id = makeId();
    }
    addTask (task) {
        this.tasks.push(task);
        task.parent = this;
        saveState(this.parent);
    }
    rmTaskById (id) {
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id == id) {
                this.tasks.splice(i,1);
                break;
            }
        }
        saveState(this.parent);
    }
    rmSelf () {
        const result = this.id;
        this.parent.rmProjById(result);
        return result;
    }
}

export class tdTask {
    constructor (title,description,dueDate,priority) {
        this.title = title,
        this.description = description,
        this.dueDate = dueDate,
        this.priority = priority,
        this.parent = null,
        this.id = makeId();
    }
    rmSelf () {
        const result = this.id;
        this.parent.rmTaskById(result);
        return result;
    }
}

export class tdProjects {
    constructor () {
        this.selected = null,
        this.list = [];
    }
    addProject(project) {
        this.list.push(project);
        project.parent = this;
        saveState(this);
    }
    rmProjById (id) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id == id) {
                this.list.splice(i,1);
                break;
            }
        }
        saveState(this);
    }
    setSelected (project) {
        this.selected = project.id;
        saveState(this);
    }
    getProjById (id) {
        for (let project of this.list) {
            if (project.id == id) {
                return project;
            }
        }
        return null;
    }
}

export function todoInit () {
    if (localStorage.getItem('todo')) {
        return getState();
    } else {
        const temp = new tdProjects;
        const def = new tdProject("Default");
        temp.addProject(def);
        return temp;
    }
}