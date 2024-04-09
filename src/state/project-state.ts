import { Project, ProjectStatus } from "../models/project.js";

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
  
export class ProjectState extends State<Project>{

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

export const projectState = ProjectState.getInstance(); // Instantiate the Project state management to be used by other Project classes