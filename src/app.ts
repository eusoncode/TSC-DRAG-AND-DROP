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

//Project Input class
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
    
    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
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

const prjInput = new ProjectInput();
