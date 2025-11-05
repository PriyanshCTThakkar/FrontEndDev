// ASSIGNMENT PART A: CATALOGUE ITEM PRESENTER COMPONENT
class CatalogueItemPresenter extends HTMLElement {

  static get observedAttributes() {
    return ['item-label', 'unit-cost']; 
  }

  constructor() {
    super(); 
    
    const _componentRoot = this.attachShadow({ mode: 'open' }); 

    const _template = document.getElementById('catalogue-item-blueprint');
    const _content = _template.content.cloneNode(true);
    _componentRoot.appendChild(_content);

    this._titleElement = _componentRoot.getElementById('item-label-display');
    this._priceElement = _componentRoot.getElementById('cost-value-output');
    this._actionButton = _componentRoot.getElementById('commit-order-button');

    this._actionButton.addEventListener('click', this._dispatchPurchaseEvent.bind(this));
  }

  connectedCallback() {
      this.attributeChangedCallback('item-label', null, this.getAttribute('item-label'));
      this.attributeChangedCallback('unit-cost', null, this.getAttribute('unit-cost'));
  }
  
  attributeChangedCallback(attrName, _oldValue, newValue) {
    if (attrName === 'item-label') {
      if (this._titleElement && newValue !== null) {
          this._titleElement.textContent = newValue;
      }
    } else if (attrName === 'unit-cost') {
      if (this._priceElement && newValue !== null) {
          this._priceElement.textContent = `$${parseFloat(newValue).toFixed(2)}`;
      }
    }
  }
  
  _dispatchPurchaseEvent() {
    const eventPayload = {
      productName: this.getAttribute('item-label'),
      price: this.getAttribute('unit-cost')
    };

    this.dispatchEvent(new CustomEvent('itemPurchaseInitiated', {
      detail: eventPayload,
      bubbles: true,
      composed: true
    }));
  }

  disconnectedCallback() {
    this._actionButton.removeEventListener('click', this._dispatchPurchaseEvent.bind(this));
  }
}

customElements.define('catalogue-item-presenter', CatalogueItemPresenter);