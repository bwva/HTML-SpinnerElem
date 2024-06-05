class SpinnerElement extends HTMLElement {
  constructor( options = {} ) {
    super();
    this.attachShadow({ mode: 'open' });
    this.setAttributes(options);
    this.rendered = false;
  }

  static get observedAttributes() {
    return [
      'rotor', 'rtr',
      'rotor-color', 'color', 'clr', 'rclr',
      'rotor-style', 'rstyle',
      'speed', 'sp', 'direction', 'dir', 'weight', 'wt',
      'background-color', 'bgclr',
      'trace-color', 'tclr',
      'prefix', 'pre', 'suffix', 'suf', 'kerning', 'kern',
      'back-color', 'bkclr',
      'rotor-status', 'rstatus', 'aria-wrap', 'awrap',
      'aria-role', 'role', 'aria-description', 'adesc',
      'style', 'name', 'id'
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

  setStandardDefaults(alts = {}) {
    const defaults = {
      rotor      :  alts.rotor     || '1000',
      rtrcolor   :  alts.rtrcolor  || 'currentColor',
      tracecolor :  alts.tracecolor|| 'rgba(20, 20, 20, .1)',
      bkcolor    :  alts.bkcolor   || '',
      bgcolor    :  alts.bgcolor   || 'transparent',
      speed      :  alts.speed     || '1',
      kerning    :  alts.kerning   || '0',
      prefix     :  alts.prefix    || '',
      suffix     :  alts.suffix    || '',
      rtrstyle   :  alts.rtrstyle  || 'solid',
      weight     :  alts.weight    || '0.195',
      direction  :  alts.direction || 'cw',
      rstatus    :  alts.rstatus   || 'running',
      awrap      :  alts.awrap     || 'none',
      ariaRole        : alts.ariaRole       || 'alert',
      ariaLive        : alts.ariaLive       || 'polite',
      ariaBusy        : alts.ariaBusy       || 'true',
      ariaAtomic      : alts.ariaAtomic     || 'true',
      ariaRelevant    : alts.ariaRelevant   || 'text',
      ariaLabel       : alts.ariaLabel      || 'Application Status',
      ariaLabelledBy  : alts.ariaLabelledBy || 'spinner-prefix spinner-suffix',
      ariaDescription : alts.ariaDescription|| ''
    };
    return defaults;
  }

  setSolidRotor() {
    this.setAttribute('rotor-style', 'solid');
  }
  setDottedRotor() {
    this.setAttribute('rotor-style', 'dotted');
  }
  setDoubleRotor() {
    this.setAttribute('rotor-style', 'double');
  }
  setDashedRotor() {
    this.setAttribute('rotor-style', 'dashed');
  }
  setGrooveRotor() {
    this.setAttribute('rotor-style', 'groove');
  }
  setRidgeRotor() {
    this.setAttribute('rotor-style', 'ridge');
  }
  setInsetRotor() {
    this.setAttribute('rotor-style', 'inset');
  }
  setOutsetRotor() {
    this.setAttribute('rotor-style', 'outset');
  }
  start() {
    this.setAttribute('rstatus', 'running');
  }
  stop() {
    this.setAttribute('rstatus', 'paused');
  }
  show() {
    this.style.setProperty('display', 'inline-block')
  }
  hide() {
    this.style.setProperty('display', 'none')
  }
  veil() {
    this.style.setProperty('visibility', 'hidden')
  }
  unveil() {
    this.style.setProperty('visibility', 'visible')
  }
  setPrefix(newPrefix = '') {
    this.setAttribute('prefix', newPrefix);
  }
  setSuffix(newSuffix = '') {
    this.setAttribute('suffix', newSuffix);
  }

  render() {
    const defaults   = this.setStandardDefaults(  ); // { rotor: '1010' }

    const rtrcolor   = this.getAttribute('color')           || this.getAttribute('clr')    ||
                       this.getAttribute('rotor-color')     || this.getAttribute('rclr')   || defaults.rtrcolor;
    const tracecolor = this.getAttribute('trace-color')     || this.getAttribute('tclr')   || defaults.tracecolor;
    const bkcolor    = this.getAttribute('back-color')      || this.getAttribute('bkclr')  || defaults.bkcolor;
    const bgcolor    = this.getAttribute('background-color')|| this.getAttribute('bgclr')  || defaults.bgcolor;
    const speed      = this.getAttribute('speed')           || this.getAttribute('sp')     || defaults.speed;
    const kerning    = this.getAttribute('kerning')         || this.getAttribute('kern')   || defaults.kerning;
    const prefix     = this.getAttribute('prefix')          || this.getAttribute('pre')    || defaults.prefix;
    const suffix     = this.getAttribute('suffix')          || this.getAttribute('suf')    || defaults.suffix;
    const rtrstyle   = this.getAttribute('rotor-style')     || this.getAttribute('rstyle') || defaults.rtrstyle;
    const rstatus    = this.getAttribute('rotor-status')    || this.getAttribute('rstatus')|| defaults.rstatus;
    const direction  = this.getAttribute('direction')       || this.getAttribute('dir')    || defaults.direction;

    const ariaRole        = this.getAttribute('role')       || defaults.ariaRole;
    const ariaLive        = defaults.ariaLive;
    const ariaBusy        = defaults.ariaBusy;
    const ariaAtomic      = defaults.ariaAtomic;
    const ariaRelevant    = defaults.ariaRelevant;
    const ariaLabel       = defaults.ariaLabel;
    const ariaLabelledBy  = defaults.ariaLabelledBy;
    const ariaDescription = this.getAttribute('aria-description') || defaults.ariaDescription;

    const spinnerHTML  = `<div><span id="spinner-prefix">${prefix}</span><span id="rotor"></span><span id="spinner-suffix">${suffix}</span></div>`;
    const awrap        = this.getAttribute('aria-wrap')     || this.getAttribute('awrap')  || defaults.awrap;
    const markup       = (awrap === 'none' || awrap === 'presentation') ? `${spinnerHTML}` :
      `<div id="ariaRegion" role="${ariaRole}" aria-live="${ariaLive}" aria-busy="${ariaBusy}"
        aria-atomic="${ariaAtomic}" aria-relevant="${ariaRelevant}" aria-label="${ariaLabel}"
        aria-labelledby="${ariaLabelledBy}" aria-description="${ariaDescription}">${spinnerHTML}</div>`;

    let weight       = this.getAttribute('weight')          || this.getAttribute('wt')     || defaults.weight;
    switch (true) {
      case (weight <= .5 && weight > 0):
        break;
      case (weight == Math.floor(weight) && weight < 11 && weight >= 1):
        weight = (.05 * weight) - .005;
        break;
      default:
        weight = defaults.weight;
        break;
    }
    const rotor       = this.getAttribute('rotor')          || this.getAttribute('rtr')  || defaults.rotor;
    const rtr_pat     = rotor.split('');
    const top_color   = rtr_pat[0] == 1 ? rtrcolor : tracecolor;
    const left_color  = rtr_pat[1] == 1 ? rtrcolor : tracecolor;
    const bottom_color= rtr_pat[2] == 1 ? rtrcolor : tracecolor;
    const right_color = rtr_pat[3] == 1 ? rtrcolor : tracecolor;

    const animation  = direction === 'cw' ? 'spinner' : 'spinner_rev';

    const backStyle = bkcolor ?
      `background-color: ${bkcolor};
         padding: .191em .38em .191em .38em;
         border-radius: .33em;
         color: ${rtrcolor};`
       : `background-color: transparent;
         color: inherit;
      `;

    const circleBorderSpinnerCss  = `
       border-radius: 50%;
       @supports (width: 1cap) {
         width:         1cap;
         height:        1cap;
         border:        calc(1cap * ${weight}) ${rtrstyle} ${tracecolor};
         border-top:    calc(1cap * ${weight}) ${rtrstyle} ${top_color};
         border-bottom: calc(1cap * ${weight}) ${rtrstyle} ${bottom_color};
         border-left:   calc(1cap * ${weight}) ${rtrstyle} ${left_color};
         border-right:  calc(1cap * ${weight}) ${rtrstyle} ${right_color};
       }
       @supports not (width: 1cap) {
         // approximation:
         width:         .7em;
         height:        .7em;
         border:        calc(.14em * ${weight}) ${rtrstyle} ${tracecolor};
         border-top:    calc(.14em * ${weight}) ${rtrstyle} ${top_color};
         border-bottom: calc(.14em * ${weight}) ${rtrstyle} ${bottom_color};
         border-left:   calc(.14em * ${weight}) ${rtrstyle} ${left_color};
         border-right:  calc(.14em * ${weight}) ${rtrstyle} ${right_color};
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
          box-sizing:       border-box;
          display:          inline-block;
          padding:          0;
          white-space:      pre;
        }
        span#rotor {
          margin-left:      ${kerning};
          margin-right:     ${kerning};
          background-color: ${bgcolor};
          ${circleBorderSpinnerCss}
          animation: ${animation} ${speed}s linear infinite ${rstatus};
        }
        div {
          display:          inline-block;
          padding:          0;
          margin:           0;
          color:            ${rtrcolor};
          ${backStyle}
        }
        div#ariaRegion {
          background-color: ${bkcolor};
          padding: .191em .38em .191em .38em;
          border: 1.6pt dotted ${rtrcolor};
          border-radius: .33em;
          color: ${rtrcolor};
        }
      </style>
      ${markup}
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

// Enable user customization of default spinner
function createSpinnerElement(tagName, defaultOptions = {}) {
  if (!tagName || tagName === 'x-spinner') {
    console.log('Custom SpinnerElement must have a unique name other than "x-spinner".');
    return;
  }
  class CustomSpinnerElement extends SpinnerElement {
    constructor(options = {}) {
      super(options); //
      this.setAttributes({ ...defaultOptions, ...options });
      this.rendered = false;
    }
    connectedCallback() {
      if (!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }
  }
  customElements.define(tagName, CustomSpinnerElement);
  return CustomSpinnerElement;
}

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
