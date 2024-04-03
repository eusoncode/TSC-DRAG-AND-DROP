//Access to the form template
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

  // Action when button submit is clicked
  private submitHandler(e:Event) {
    e.preventDefault();
    console.log(this.titleInputElement.value);    
  }

  // Listen for button submit event
  private configure() {
    this.element.addEventListener('submit', this.submitHandler.bind(this))
  }

  // Render to the Div html
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
