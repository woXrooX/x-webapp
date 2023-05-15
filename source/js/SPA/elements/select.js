// https://web.dev/more-capable-form-controls/

"use strict";

export default class Select extends HTMLElement{
  // Identify the element as a form-associated custom element
  static formAssociated = true;

  static #template = document.createElement("template");

  static {
    Select.#template.innerHTML = `
      <button>Select</button>
      <main>
        <section id="optionsSelected"></section>
        <!-- <section id="search">
          <input type="text" placeholder="Search...">
        </section> -->
        <section id="optionsToSelect"></section>
      </main>
    `;
  }

  constructor(){
    super();

    // Get access to the internal form control APIs
    this.internals_ = this.attachInternals();
    // internal value for this control
    this.value_ = null;

    this.shadow = this.attachShadow({mode: 'closed'});

    CSS: {
      const style = document.createElement('style');
      style.textContent = `
        ${window.CSS.rules.scrollbar}
        ${window.CSS.rules.form}

        *{
          box-sizing: border-box;
        }

        button{
          width: 100%;
          margin-bottom: calc(var(--padding) * 2);
        }

        main{
          background-color: var(--color-surface-1);
          width: 100%;
          padding: var(--padding);
          border-radius: var(--radius);

          display: none;
          flex-direction: column;
          gap: calc(var(--gap) / 2);
        }
        main.show{
          display: flex;
        }

        main > section{
          background-color: var(--color-surface-2);
          padding: var(--padding);
          border-radius: var(--radius);
        }

        main > section#optionsSelected{
          display: none;
          flex-wrap: wrap;
          flex-direction: row;
          gap: calc(var(--gap) / 2);

        }
        main > section#optionsSelected.show{
          display: flex;
        }

        main > section#optionsSelected > div{
          display: none;
        }

        main > section#search{
        }

        main > section#optionsToSelect{
          max-height: 250px;
          overflow: scroll;

          display: flex;
          flex-direction: column;
          gap: calc(var(--gap) / 2);

        }
        main > section#optionsToSelect.hide{
          display: none;
        }

        main > section#optionsSelected > div,
        main > section#optionsToSelect > div{
          cursor: pointer;
          background-color: var(--color-surface-3);
          width: auto;
          height: auto;
          padding: var(--padding);
          border-radius: var(--radius);
          transition: var(--transition-velocity) ease-in-out background-color;
        }

        main > section#optionsSelected > div:hover,
        main > section#optionsToSelect > div:hover{
          user-select: none;
          background-color: var(--color-surface-4);
        }

      `;
      this.shadow.appendChild(style);
    }

    // Clone And Append Template
    this.shadow.appendChild(Select.#template.content.cloneNode(true));

    GenerateOptions: {
      // Options
      this.options = JSON.parse(this.innerHTML).constructor === Array ? JSON.parse(this.innerHTML) : [];

      let optionsHtml = "";

      //// Max Number Of Options That Can Be Selected
      // Default/Fallback Is 1
      this.MAX = 1;
      if(
        // Has Attribute
        this.hasAttribute('max') &&

        // If Valid Number
        isNaN(parseInt(this.getAttribute('max'))) === false &&

        // Positive Number
        parseInt(this.getAttribute('max')) >= 0
      )
        this.MAX = parseInt(this.getAttribute('max'));

      else this.MAX = this.options.length || this.MAX;

      for(const option of this.options)
        optionsHtml += `<div value="${option["value"]}">${option.placeholder}</div>`;


      this.shadow.querySelector("main > section#optionsSelected").innerHTML = `
        ${optionsHtml}
      `;

      this.shadow.querySelector("main > section#optionsToSelect").innerHTML = `
        ${optionsHtml}
      `;

    }

    // Show And Hide The "main"
    Toggle: {
      const button = this.shadow.querySelector("button");
      button.innerHTML = this.hasAttribute("placeholder") ? window.Lang.use(this.getAttribute('placeholder')) : window.Lang.use("select");

      // On Click
      button.addEventListener("click", ()=>{
        this.shadow.querySelector("main").classList.toggle("show");

      });

    }

    SelectDeselect: {
      // Create FormData
      const entries = new FormData();

      let options = this.shadow.querySelectorAll("main > section#optionsToSelect > div");
      let optionsSelected = this.shadow.querySelectorAll("main > section#optionsSelected > div");
      let count = 0;

      // Select
      for(const option of options)
        option.addEventListener("click", ()=>{

          // Check If Exceed The Max
          if(count >= this.MAX){
            window.Toast.new("info", "Maximum number of options you can select is: " + this.getAttribute('max'))
            return;
          }

          // Increment The Count
          count++;

          // Show "optionsSelected"
          if(count === 1) this.shadow.querySelector("main > section#optionsSelected").classList.add("show");

          // Hide Section 'optionsToSelect' Only Once When count Equals To MAX
          if(count === this.options.length) this.shadow.querySelector("main > section#optionsToSelect").classList.add("hide");

          // Hide Option From "optionsToSelect"
          option.style.display = "none";

          // Show Option On "optionsSelected"
          this.shadow.querySelector(`main > section#optionsSelected > div[value="${option.getAttribute("value")}"]`).style.display = "block";

          // Add To Form Entry
          entries.append(this.getAttribute('name'), option.getAttribute("value"));

          // Add To Form Data
          this.internals_.setFormValue(entries);

        });

      // Deselect
      for(const option of optionsSelected)
        option.addEventListener("click", ()=>{
          // Decrement The Count
          count--;

          // Hide "optionsSelected"
          if(count === 0) this.shadow.querySelector("main > section#optionsSelected").classList.remove("show");

          // Show Section 'optionsToSelect' Only Once When count Equals To MAX
          if(count === this.options.length - 1) this.shadow.querySelector("main > section#optionsToSelect").classList.remove("hide");

          // Hide Option From "optionsSelected"
          option.style.display = "none";

          // Show Option On "optionsToSelect"
          this.shadow.querySelector(`main > section#optionsToSelect > div[value="${option.getAttribute("value")}"]`).style.display = "block";

          // Delete Form Entry
          entries.delete(this.getAttribute('name'), option.getAttribute("value"));

          // Add To Form Data
          this.internals_.setFormValue(entries);

        });

    }


  }

  ////// Form Methods/APIs
  // Form controls usually expose a "value" property
  // get value() { return this.value_; }
  // set value(v) { this.value_ = v; }
  //
  // // The following properties and methods aren't strictly required,
  // // but browser-level form controls provide them. Providing them helps
  // // ensure consistency with browser-provided controls.
  // get form() { return this.internals_.form; }
  // get name() { return this.getAttribute('name'); }
  // get type() { return this.localName; }
  // get validity() {return this.internals_.validity; }
  // get validationMessage() {return this.internals_.validationMessage; }
  // get willValidate() {return this.internals_.willValidate; }
  //
  // checkValidity() { return this.internals_.checkValidity(); }
  // reportValidity() {return this.internals_.reportValidity(); }

};

window.customElements.define('x-select', Select);

// Make Select Usable W/O Importing It
window.Select = Select;

// Breaks The Order
// Moves The Element
// MoveOptions: {
//   let options = this.shadow.querySelectorAll("main > section#options > div");
//   let sectionSelected = this.shadow.querySelector("main > section#optionsSelected");
//   let sectionOptions = this.shadow.querySelector("main > section#options");
//
//   for(const option of options)
//     option.addEventListener("click", ()=>{
//       if(option.parentNode.id === "options") sectionSelected.appendChild(option);
//       else sectionOptions.appendChild(option);
//     });
// }
