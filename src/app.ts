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
  // Listener type
  type Listener = (items: Project[]) => void;
  
class ProjectState {

  private listeners: Listener[] = []; // List of listeners
  private projects: Project[] = []; // List of projects

  // Make an instance of the Project state class so that only one instance is instantiated
  private static instance: ProjectState;
  private constructor() {};
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState;
    return this.instance;
  }

  addListener(listenerFn:Listener) {
    this.listeners.push(listenerFn)
  };

  addProject(title: string, description: string, numOfPeople:number) {
    const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.active);
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // Call listeners when something changes in project list
    }
  };
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

// ProjectList class
class ProjectList {
  //Define the variables
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement; //Access the project list template html
    this.hostElement = document.getElementById('app')! as HTMLDivElement; //Access the div html
    this.assignedProjects = [];

    const importedNode = document.importNode(this.templateElement.content, true); //Import the project list template
    this.element = importedNode.firstElementChild as HTMLElement; // Access the section in the input template
    this.element.id = `${this.type}-projects`; // Style the form before rendering

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  // 
  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLElement;
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  // Render content to the project list template
  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    this.element.querySelector('ul')!.id = listId;
  }

  // Render to the Div html
  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}

// Project Input class
class ProjectInput {
  //Define the variables
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement; //Access the input template html
    this.hostElement = document.getElementById('app')! as HTMLDivElement; //Access the div html

    const importedNode = document.importNode(this.templateElement.content, true); //Import the input template
    this.element = importedNode.firstElementChild as HTMLFormElement; // Access the form in the input template
    this.element.id = 'user-input'; // Style the form before rendering

    this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement; // Access the values of the input on the form
    this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
    this.peopleInputElement= this.element.querySelector('#people')! as HTMLInputElement;

    this.configure(); // Trigger the event listener for the submit button
    this.attach(); // Render form on the div html
  }

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

  // Listen for button submit event
  private configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }

  // Render to the Div html
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput(); //Render project inputs
const activePrjList = new ProjectList('active'); // Render active project lists
const finishedPrjList = new ProjectList('finished'); // Render finished project lists
