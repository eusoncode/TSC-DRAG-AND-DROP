/// <reference path="models/drag-drop.ts"/>
/// <reference path="models/drag-drop.ts"/>
/// <reference path="state/project-state.ts"/>
/// <reference path="utils/validation.ts"/>
/// <reference path="components/project-input.ts"/>
/// <reference path="components/project-list.ts"/>
/// <reference path="components/project-item.ts"/>

namespace App {  
  new ProjectInput(); //Render project inputs
  new ProjectList('active'); // Render active project lists
  new ProjectList('finished'); // Render finished project lists  
}

