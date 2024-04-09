/// <reference path="base-component.ts"/>
/// <reference path="../decorators/autobind.ts"/>
/// <reference path="../state/project-state.ts"/>
/// <reference path="../models/project.ts"/>
/// <reference path="../models/drag-drop.ts"/>

namespace App{
  // ProjectList class
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
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
}