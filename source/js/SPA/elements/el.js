"use strict";

export default class El extends HTMLElement{
  constructor(){
    super();

    this.shadow = this.attachShadow({mode: 'closed'});

    DOM: {
      // const content = JSON.parse(this.textContent);
      //
      // const dom = Dom.jsonToDom(content);
      //
      // this.shadow.appendChild(dom);

    }

    // CSS: {
    //     const style = document.createElement('style');
    //     style.textContent = ``;
    //     // shadow.appendChild(style);
    // }
  }

  connectedCallback(){
    console.log("connectedCallback");
  }

  disconnectedCallback(){
    console.log("connectedCallback");
  }

  adoptedCallback(){
    console.log("adoptedCallback");
  }

  // List Attributes To Be Observed
  static get observedAttributes(){
    return ["attr1", "attr2"];
  }

  // name = attribute name
  // old and new attribute values
  attributeChangedCallback(attributeName, oldValue, newValue){
    console.log("attributeChangedCallback");
  }

};

window.customElements.define('x-el', El);
