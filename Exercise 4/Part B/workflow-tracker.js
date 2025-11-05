// ASSIGNMENT PART B: WORKFLOW TRACKER INTERFACE COMPONENT
class WorkflowTrackerInterface extends HTMLElement {

  constructor() {
    super(); 
    
    this._workflowStateList = []; 
    
    this._componentRoot = this.attachShadow({ mode: 'open' }); 

    this._componentRoot.innerHTML = `
      <style>
        :host {
          display: flex; 
          flex-direction: column;
          gap: 1rem;
          border: 1px solid #95a5a6;
          padding: 1.5rem;
        }
        .task-input-control {
          display: flex;
          gap: 0.5rem;
        }
        .add-task-btn {
          background-color: #9955FF;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
        .task-input-field {
            flex-grow: 1; 
            padding: 0.75rem;
            border: 2px solid #D8BFD8;
            border-radius: 6px;
        }
        .task-list-display {
            list-style: decimal inside;
        }
      </style>
      
      <main>
        <form id="task-entry-form" class="task-input-control">
          <input type="text" id="new-task-input-field" class="task-input-field" placeholder="Add a new step..." required>
          <button type="submit" id="task-add-button" class="add-task-btn">
            Include Step
          </button>
        </form>
        
        <ol id="step-list-output" class="task-list-display"></ol>
      </main>
    `;

    this._inputFieldRef = this._componentRoot.getElementById('new-task-input-field');
    this._listContainerRef = this._componentRoot.getElementById('step-list-output');
    this._formRef = this._componentRoot.getElementById('task-entry-form');

    this._formRef.addEventListener('submit', this._processStepAddition.bind(this));
  }

  _renderTaskDisplay() {
    const fragment = document.createDocumentFragment();
    
    this._workflowStateList.forEach((task) => {
      const listItem = document.createElement('li');
      listItem.textContent = task;
      fragment.appendChild(listItem);
    });
    
    this._listContainerRef.textContent = ''; 
    this._listContainerRef.appendChild(fragment); 
  }

  _processStepAddition(event) {
    event.preventDefault(); 
    const taskContent = this._inputFieldRef.value.trim();
    
    if (taskContent) {
      this._workflowStateList.push(taskContent); 
      this._inputFieldRef.value = ''; 
      this._renderTaskDisplay(); 
      this._emitStateChange(); 
    }
  }

  _emitStateChange() {
    this.dispatchEvent(new CustomEvent('workflowStateUpdated', {
      detail: { currentSteps: [...this._workflowStateList] },
      bubbles: true,
      composed: true 
    }));
  }
}

customElements.define('workflow-tracker-interface', WorkflowTrackerInterface);