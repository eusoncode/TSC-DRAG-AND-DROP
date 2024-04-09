/// <reference path="base-component.ts"/>
/// <reference path="../decorators/autobind.ts"/>
/// <reference path="../utils/validation.ts"/>
/// <reference path="../state/project-state.ts"/>

namespace App{
  // Project Input class
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
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
}