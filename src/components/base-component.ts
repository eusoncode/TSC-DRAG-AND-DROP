namespace App {
  // Component Base Class for Project List and Project Input
  export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
}