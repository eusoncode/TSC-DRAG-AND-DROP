/// <reference path="drag-drop-interfaces.ts"/>

namespace App {    
  // Project Type
  enum ProjectStatus { 'active', 'finished'};
  class Project {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public people: number,
      public status: ProjectStatus
    ) {}
  }
  
  // Project state management
  // Listener generic type
  type Listener<T> = (items: T[]) => void;
  
  //Component base class for Project state
  class State<T> {
    protected listeners: Listener<T>[] = []; // List of listeners
    addListener(listenerFn:Listener<T>) {
      this.listeners.push(listenerFn)
    };
  };
    
  class ProjectState extends State<Project>{
  
    private projects: Project[] = []; // List of projects
  
    // Make an instance of the Project state class so that only one instance is instantiated
    private static instance: ProjectState;
    private constructor() {
      super();
    };
    static getInstance() {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new ProjectState;
      return this.instance;
    }
  
    addProject(title: string, description: string, numOfPeople:number) {
      const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.active);
      this.projects.push(newProject);
      this.updateListeners();
    };
  
    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find(prj => prj.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateListeners();
      }
    }
  
    private updateListeners() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice()); // Call listeners when something changes in project list
      }    
    }
  }
  
  const projectState = ProjectState.getInstance(); // Instantiate the Project state management to be used by other Project classes
  
  // Re-usable Validation
  interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }
  
  function validate(validatableInput:Validatable) {
    let isValid = true;
  
    if (validatableInput.required) {
      isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
      isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
      isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min!= null && typeof validatableInput.value === 'number') {
      isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max!= null && typeof validatableInput.value === 'number') {
      isValid = isValid && validatableInput.value >= validatableInput.max;
    }
  
    return isValid;
  }
  
  // Autobind decorator - function decoration
  function autobind(_:any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;  
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        const boundFn = originalMethod.bind(this);
        return boundFn;
      }
    };
    return adjDescriptor;
  }
  
  // Component Base Class for Project List and Project Input
  abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    //Define the variables
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
  
    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {    
      this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement; //Access the project list template html
      this.hostElement = document.getElementById(hostElementId)! as T; //Access the div html
  
      const importedNode = document.importNode(this.templateElement.content, true); //Import the project list template
      this.element = importedNode.firstElementChild as U; // Access the section in the input template
      if (newElementId) {     
        this.element.id = newElementId; // Style the form before rendering 
      }
  
      this.attach(insertAtStart);
    }
  
    // Render to the Div html
    private attach(insertAtBegining: boolean) {
      this.hostElement.insertAdjacentElement(insertAtBegining ? 'afterbegin' : 'beforeend', this.element);
    }
  
    abstract configure(): void; // Trigger the event listener for the submit button
    abstract renderContent(): void; // Render content to the project list template
  }
  
  // ProjectItem class
  class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
    private project: Project;
    get persons() { //use to return the right text
      if (this.project.people === 1) {
        return '1 person'
      } else {
        return `${this.project.people} persons`;
      }
    }
    constructor(hostId: string, project: Project) {
      super('single-project', hostId, false, project.id);
      this.project = project;
      this.configure();
      this.renderContent();
    }
    
    // Drag listeners
    @autobind
    dragStartHandler(event: DragEvent) {
      event.dataTransfer!.setData('text/plain', this.project.id);
      event.dataTransfer!.effectAllowed = 'move';
    }; 
  
    @autobind
    dragEndHandler(_: DragEvent) {
      console.log('DragEnd');    
    };
  
    configure() {
      this.element.addEventListener('dragstart', this.dragStartHandler);  
      this.element.addEventListener('dragend', this.dragEndHandler);
    };
    
    renderContent() {
      this.element.querySelector('h2')!.textContent = this.project.title;
      this.element.querySelector('h3')!.textContent = this.persons + '  assigned';
      this.element.querySelector('p')!.textContent = this.project.description;
    };
    
  }
  
  // ProjectList class
  class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
    assignedProjects: Project[];
  
    constructor(private type: 'active' | 'finished') {
      super('project-list', 'app', false, `${type}-projects`); // Style the form before rendering
      this.assignedProjects = [];
  
      this.configure();
      this.renderContent();
    }
  
    // Drag listeners
    @autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault();
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.add('droppable');      
      }
    };
  
    @autobind
    dropHandler(event: DragEvent) {
      const prjId = event.dataTransfer!.getData('text/plain');
      projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.active : ProjectStatus.finished)
    };
  
    @autobind
    dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.remove('droppable');      
    };
  
    // Listen for changes in the Project state
    configure() {
      this.element.addEventListener('dragover', this.dragOverHandler);
      this.element.addEventListener('drop', this.dropHandler);
      this.element.addEventListener('dragleave', this.dragLeaveHandler);
  
      projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter(prj => {
          if (this.type === 'active') {          
            return prj.status === ProjectStatus.active;
          }        
          return prj.status === ProjectStatus.finished;
        })
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }
    
    // Render content to the project list template
    renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
      this.element.querySelector('ul')!.id = listId;
    }
  
    // Render project in the Project list
    private renderProjects() {
      const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
      listEl.innerHTML = ''; // Clear already render projects
      for (const prjItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
      }
    }
  }
  
  // Project Input class
  class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
  
    constructor() {
      super('project-input', 'app', true, 'user-input');
  
      this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement; // Access the values of the input on the form
      this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;
      
  
      this.configure(); // Trigger the event listener for the submit button
      this.renderContent();
    }
  
    // Listen for button submit event
    configure() {
      this.element.addEventListener('submit', this.submitHandler)
    }
  
    //Render to the Project List
    renderContent() {};
  
    // Clear inputs after submission
    private clearInputs() {
      this.titleInputElement.value = '';
      this.descriptionInputElement.value = '';
      this.peopleInputElement.value = '';
    }
  
    // Fetching User Input
    private gatherUserInput(): [string, string, number] | void { 
      const enteredTitle = this.titleInputElement.value;
      const enteredDescription = this.descriptionInputElement.value;
      const enteredPeople = this.peopleInputElement.value;
  
      const titleValidatable: Validatable = {
        value: enteredTitle,
        required: true
      };
  
      const descriptionValidatable: Validatable = {
        value: enteredDescription,
        required: true,
        minLength: 5
      };
  
      const peopleValidatable: Validatable = {
        value: enteredPeople,
        required: true,
        min: 1
      };
      
      if (
        !validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(peopleValidatable)
      ) {
        alert('Invalid input, please try again!');
        return;
      } else {
        return [enteredTitle, enteredDescription, +enteredPeople]
      }
    };
  
    // Action when button submit is clicked
    @autobind
    private submitHandler(event:Event) {
      event.preventDefault();
      const userInput = this.gatherUserInput();
  
      if (Array.isArray(userInput)) {
        const [title, desc, people] = userInput;
        console.log(title, desc, people); 
        projectState.addProject(title, desc, people); // Add project to the state management class
        this.clearInputs();
      }
    }
  }
  
  new ProjectInput(); //Render project inputs
  new ProjectList('active'); // Render active project lists
  new ProjectList('finished'); // Render finished project lists  
}

