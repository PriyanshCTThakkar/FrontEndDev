Product Card Component

Component: <product-card-unique>

Functionality:

Encapsulation: Uses Shadow DOM to fully isolate internal HTML and CSS styles from the main page.

Data Handling: Accepts product information (Name and Price) via Attributes.

Content Projection: Uses Slots to project the product image and description from the light DOM into the component's encapsulated structure.

Interactivity: The internal button triggers a custom 'purchase' event that communicates the selected product's data back to the main page.