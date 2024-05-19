class SpinnerElement extends HTMLElement {
  constructor( options = {} ) {
    super();
    this.attachShadow({ mode: 'open' });
    this.setAttributes(options);
  }

  static get observedAttributes() {
    return [
      'color', 'clr', 'speed', 'sp', 'direction', 'dir',
      'background-color', 'bgclr',
      'trace-color', 'tclr', 'cursor', 'crsr',
      'prefix', 'pre', 'suffix', 'suf', 'kerning', 'kern',
      'back-color', 'bkclr', 'weight', 'wt',
      'cursor-style', 'cstyle', 'style', 'name', 'id'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.constructor.observedAttributes.includes(name)) {
    this.render();
    }
  }

  setAttributes(options = {}) {
   const observedAttributes = this.constructor.observedAttributes;
   Object.entries(options).forEach(([key, value]) => {
     if (observedAttributes.includes(key)) {
       this.setAttribute(key, value);
     } else {
       console.warn(`Ignoring unknown attribute "${key}" for <x-spinner>`);
     }
    });
  }

  setStyle(style = {}) {
    Object.entries(style).forEach(([property, value]) => {
      this.style.setProperty(property, value);
    });
  }

  setSolidCursor() {
    this.setAttribute('cursor-style', 'solid');
  }
  setDottedCursor() {
    this.setAttribute('cursor-style', 'dotted');
  }
  setDoubleCursor() {
    this.setAttribute('cursor-style', 'double');
  }
  setDashedCursor() {
    this.setAttribute('cursor-style', 'dashed');
  }
  setGrooveCursor() {
    this.setAttribute('cursor-style', 'groove');
  }
  setRidgeCursor() {
    this.setAttribute('cursor-style', 'ridge');
  }
  setInsetCursor() {
    this.setAttribute('cursor-style', 'inset');
  }
  setOutsetCursor() {
    this.setAttribute('cursor-style', 'outset');
  }

  render() {
    const crsrcolor  = this.getAttribute('color')       || this.getAttribute('clr')   || 'currentColor';
    const tracecolor = this.getAttribute('trace-color') || this.getAttribute('tclr')  || 'rgba(20, 20, 20, .1)';
    const bkcolor    = this.getAttribute('back-color')  || this.getAttribute('bkclr')  || '';
    const bgcolor    = this.getAttribute('background-color') || this.getAttribute('bgclr')  || 'transparent';

    const speed      = this.getAttribute('speed')       || this.getAttribute('sp')    || '1';
    const kerning    = this.getAttribute('kerning')     || this.getAttribute('kern')  || '0';
    const prefix     = this.getAttribute('prefix')      || this.getAttribute('pre')   || '';
    const suffix     = this.getAttribute('suffix')      || this.getAttribute('suf')   || '';
    const cstyle     = this.getAttribute('cursor-style')|| this.getAttribute('cstyle')|| 'solid';

    let weight       = this.getAttribute('weight')      || this.getAttribute('wt')    || '0.195';
    switch (true) {
      case (weight <= .5 && weight > 0):
        break;
      case (weight == Math.floor(weight) && weight < 11 && weight >= 1):
        weight = (.05 * weight) - .005;
        break;
      default:
        weight = .195;
        break;
    }

    const direction  = this.getAttribute('direction')   || this.getAttribute('dir')   || 'cw';
    const animation  = direction === 'cw' ? 'spinner' : 'spinner_rev';

    const cursor       = this.getAttribute('cursor')      || this.getAttribute('crsr')  || '1000';
    const crsr_pat     = cursor.split('');
    const top_color    = crsr_pat[0] == 1 ? crsrcolor : tracecolor;
    const left_color   = crsr_pat[1] == 1 ? crsrcolor : tracecolor;
    const bottom_color = crsr_pat[2] == 1 ? crsrcolor : tracecolor;
    const right_color  = crsr_pat[3] == 1 ? crsrcolor : tracecolor;

    const backStyle = bkcolor ?
      `background-color: ${bkcolor};
         padding: .191em .38em .191em .38em;
         border-radius: .33em;
         color: ${crsrcolor};`
    : `background-color: transparent;
         color: inherit;`;

    const circleBorderSpinnerCss  = `
       border-radius: 50%;
       @supports (width: 1cap) {
         width:         1cap;
         height:        1cap;
         border:        ${weight}cap ${cstyle} ${tracecolor};
         border-top:    ${weight}cap ${cstyle} ${top_color};
         border-bottom: ${weight}cap ${cstyle} ${bottom_color};
         border-left:   ${weight}cap ${cstyle} ${left_color};
         border-right:  ${weight}cap ${cstyle} ${right_color};
       }
       @supports not (width: 1cap) {
         // approximation:
         width:         .7em;
         height:        .7em;
         border:        .14em ${cstyle} ${tracecolor};
         border-top:    .14em ${cstyle} ${top_color};
         border-bottom: .14em ${cstyle} ${bottom_color};
         border-left:   .14em ${cstyle} ${left_color};
         border-right:  .14em ${cstyle} ${right_color};
       }
    `;

    this.shadowRoot.innerHTML = `
      <style>
        @keyframes spinner {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinner_rev {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        span {
          display:      inline-block;
          padding:      0;
          box-sizing:   border-box;
          margin-left:    ${kerning};
          margin-right:   ${kerning};
          background-color: ${bgcolor};
      ${circleBorderSpinnerCss}
          animation: ${animation} ${speed}s linear infinite;
        }
        div {
          display:          inline-block;
          padding:          0;
          margin:           0;
          color:            ${crsrcolor};
          ${backStyle}
        }
      </style>
      <div>${prefix}<span></span>${suffix}</div>
    `;
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
}
customElements.define('x-spinner', SpinnerElement);

/* Some basic functions */

function insertSpinner(spinner,target,options) {
  const targetElement = (typeof target === 'string') ?
    document.querySelector(target) : target;
  targetElement.innerHTML = '';
  targetElement.appendChild(spinner);
}

function appendSpinner(spinner,target,options) {
  const targetElement = (typeof target === 'string') ?
    document.querySelector(target) : target;
  targetElement.appendChild(spinner);
}

function removeSpinner(spinner) {
  if (spinner instanceof SpinnerElement) {
    spinner.remove();
  }
  else if (typeof spinner === 'string') {
    const spinnerElement = document.querySelector(spinner);
    if (spinnerElement instanceof SpinnerElement) {
      spinnerElement.remove();
    }
  } else {
    console.warn('Invalid argument for removeSpinner. Expected a SpinnerElement instance or a selector string.');
  }
}
