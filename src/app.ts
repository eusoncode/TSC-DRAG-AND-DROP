//Access to the form template
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement; //Access the input template html
    this.hostElement = document.getElementById('app')! as HTMLDivElement; //Access the div html

    const importedNode = document.importNode(this.templateElement.content, true); //Import the input template
    this.element = importedNode.firstElementChild as HTMLFormElement; // Access the form in the input template
    this.attach(); // Render form on the div html
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
