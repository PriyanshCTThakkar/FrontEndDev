Part B: To-Do List Component

Component: <todo-list>

Functionality:

State Management: Maintains and updates an internal list of text items (the component's internal state).

Rendering: The list, input field, and "Add" button are rendered entirely within the component's Shadow DOM.

Communication: Emits a 'listChanged' custom event whenever an item is added or removed, allowing the main application to react to the component's internal state changes.

Local Styles: CSS is scoped and encapsulated, preventing style leaks.