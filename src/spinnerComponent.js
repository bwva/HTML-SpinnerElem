class SpinnerElement extends HTMLElement {
  constructor( options = {} ) {
    super();
    this.attachShadow({ mode: 'open' });
    this.observedAttributesSet = new Set(this.constructor.observedAttributes);
    this.setAttributes(options);
    this.rendered = false;
  }

  static observedAttributes = [
      'rotor', 'rtr',
      'rotor-style', 'rstyle',
      'speed', 'sp', 'direction', 'dir', 'weight', 'wt',
      'rotor-color', 'rclr', // same as 'color'
      'background-color', 'bgclr',
      'trace-color', 'tclr',
      'back-color', 'bkclr',
      'prefix', 'pre', 'suffix', 'suf', 'kerning', 'kern',
      'rotor-status', 'rstatus',
      'aria-wrap', 'awrap',
      'aria-role', 'role', 'aria-description',
      'aria-label', 'aria-busy', 'aria-live',
      // these are standard attributes:
      'color', 'style', 'name', 'id'
  ];

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.observedAttributesSet.has(name)) {
      this.render();
    }
  }

  setAttributes( options = {} ) {
    Object.entries(options).forEach(([key, value]) => {
      if (this.observedAttributesSet.has(key)) {
        this.setAttribute(key, value);
      } else {
        console.warn(`Ignoring unknown attribute "${key}" for <x-spinner>`);
      }
    });
  }

  setStyle( style = {} ) {
    Object.entries(style).forEach(([property, value]) => {
      this.style.setProperty(property, value);
    });
  }

  setDefaults( alts = {} ) {
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
      awrap      :  alts.awrap               || 'none',
      ariaRole        : alts.ariaRole        || 'alert',
      ariaLive        : alts.ariaLive        || 'polite',
      ariaBusy        : alts.ariaBusy        || 'true',
      ariaAtomic      : alts.ariaAtomic      || 'true',
      ariaRelevant    : alts.ariaRelevant    || 'text',
      ariaLabel       : alts.ariaLabel       || 'Application Status',
      ariaLabelledBy  : alts.ariaLabelledBy  || 'spinner-prefix spinner-suffix',
      ariaDescription : alts.ariaDescription || ''
    };
    return defaults;
  }

  // operation
  // run & go are the same
  run() {
    this.setAttribute('rstatus', 'running');
  }
  go() {
    this.setAttribute('rstatus', 'running');
  }
  // pause & stop are the same
  pause() {
    this.setAttribute('rstatus', 'paused');
  }
  stop() {
    this.setAttribute('rstatus', 'paused');
  }
  stopGo() {
    const newStatus = (this.getAttribute('rstatus') === 'paused') ?
      'running' : 'paused';
    this.setAttribute('rstatus', newStatus);
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

  // convenience methods
  setRotor( style = 'solid' ) {
    this.setAttribute('rotor-style', style);
  }
  setWeight( wt = 'this.defaults.weight') {
    this.setAttribute('weight', wt);
  }
  setPrefix(newPrefix = '') {
     this.setAttribute('prefix', newPrefix);
  }
  setSuffix(newSuffix = '') {
    this.setAttribute('suffix', newSuffix);
  }
  toString() {
    return this.shadowRoot ? this.shadowRoot.innerHTML : '';
  }

  // The main show
  render() {
    const defaults     = this.setDefaults( {  } ); // { rotor: '1010' }

    const spAttributes = Array.from(this.attributes).reduce((obj, attr) => {
      if (this.observedAttributesSet.has(attr.name)) {
        obj[attr.name] = attr.value;
      }
      return obj;
    }, {});

    const rotor      = spAttributes['rotor']           ||= spAttributes['rtr']    || defaults.rotor;
    const rtrcolor   = spAttributes['rotor-color']     ||= spAttributes['rclr']   ||= spAttributes['color'] || defaults.rtrcolor;
    const tracecolor = spAttributes['trace-color']     ||= spAttributes['tclr']   || defaults.tracecolor;
    const bkcolor    = spAttributes['back-color']      ||= spAttributes['bkclr']  || defaults.bkcolor;
    const bgcolor    = spAttributes['background-color']||= spAttributes['bgclr']  || defaults.bgcolor;
    const speed      = spAttributes['speed']           ||= spAttributes['sp']     || defaults.speed;
    const kerning    = spAttributes['kerning']         ||= spAttributes['kern']   || defaults.kerning;
    const prefix     = spAttributes['prefix']          ||= spAttributes['pre']    || defaults.prefix;
    const suffix     = spAttributes['suffix']          ||= spAttributes['suf']    || defaults.suffix;
    const rtrstyle   = spAttributes['rotor-style']     ||= spAttributes['rstyle'] || defaults.rtrstyle;
    const rstatus    = spAttributes['rotor-status']    ||= spAttributes['rstatus']|| defaults.rstatus;
    const direction  = spAttributes['direction']       ||= spAttributes['dir']    || defaults.direction;
    const weight     = spAttributes['weight']          ||= spAttributes['wt']     || defaults.weight;

    const awrap           = spAttributes['aria-wrap']        ||= spAttributes['awrap']   || defaults.awrap;
    const ariaRole        = spAttributes['aria-role']        ||= spAttributes['role']    || defaults.ariaRole;
    const ariaLabel       = spAttributes['aria-label']       || defaults.ariaLabel;
    const ariaBusy        = spAttributes['aria-busy']        || defaults.ariaBusy;
    const ariaLive        = spAttributes['aria-live']        || defaults.ariaLive;
    const ariaDescription = spAttributes['aria-description'] || defaults.ariaDescription;
    const ariaAtomic      = defaults.ariaAtomic;
    const ariaRelevant    = defaults.ariaRelevant;
    const ariaLabelledBy  = defaults.ariaLabelledBy;

    // using weight
    let rWeight;
    if (weight <= .5 && weight > 0) {
      rWeight  = weight;
    }
    else if (weight == Math.floor(weight) && weight < 11 && weight >= 1) {
      rWeight  = (.05 * weight) - .005;
    }
    else {
      rWeight  = defaults.weight;
    }

    // using rotor
    const rtr_pat     = rotor.split('');
    const top_color   = rtr_pat[0] == 1 ? rtrcolor : tracecolor;
    const left_color  = rtr_pat[1] == 1 ? rtrcolor : tracecolor;
    const bottom_color= rtr_pat[2] == 1 ? rtrcolor : tracecolor;
    const right_color = rtr_pat[3] == 1 ? rtrcolor : tracecolor;

    // using direction
    const rtFrom      = '0deg';
    const rtTo        = direction === 'cw' ? '360deg' : '-360deg';

    // composing the spinner element
    const spinnerHTML  = `<div><span id="spinner-prefix">${prefix}</span><span id="rotor"></span><span id="spinner-suffix">${suffix}</span></div>`;
    const markup       = (awrap === 'none' || awrap === 'presentation' || awrap === 'ignore') ? `${spinnerHTML}` :
      `<div id="ariaRegion" role="${ariaRole}" aria-live="${ariaLive}" aria-busy="${ariaBusy}"
        aria-atomic="${ariaAtomic}" aria-relevant="${ariaRelevant}" aria-label="${ariaLabel}"
        aria-labelledby="${ariaLabelledBy}" aria-description="${ariaDescription}">${spinnerHTML}</div>`;

    const backStyle = bkcolor ?
      `background-color: ${bkcolor};
         padding:           .191em .38em .191em .38em;
         border-radius:     .33em;
         color:             ${rtrcolor};
`   : `background-color: transparent;
          color:            inherit;
`;

    const circleBorderSpinnerCss  = CSS.supports('width', '1cap') ?
`border-radius: 50%;
          width:            1cap;
          height:           1cap;
          border:           calc(1cap * ${rWeight}) ${rtrstyle} ${tracecolor};
          border-top:       calc(1cap * ${rWeight}) ${rtrstyle} ${top_color};
          border-bottom:    calc(1cap * ${rWeight}) ${rtrstyle} ${bottom_color};
          border-left:      calc(1cap * ${rWeight}) ${rtrstyle} ${left_color};
          border-right:     calc(1cap * ${rWeight}) ${rtrstyle} ${right_color};
` :
`          // approximation:
          width:            .7em;
          height:           .7em;
          border:           calc(.14em * ${rWeight}) ${rtrstyle} ${tracecolor};
          border-top:       calc(.14em * ${rWeight}) ${rtrstyle} ${top_color};
          border-bottom:    calc(.14em * ${rWeight}) ${rtrstyle} ${bottom_color};
          border-left:      calc(.14em * ${rWeight}) ${rtrstyle} ${left_color};
          border-right:     calc(.14em * ${rWeight}) ${rtrstyle} ${right_color};
`;

    this.shadowRoot.innerHTML = `
      <style>
        @keyframes spinner {
          0%   { transform: rotate( ${rtFrom} ); }
          100% { transform: rotate( ${rtTo} ); }
        }
        span {
          box-sizing:       border-box;
          display:          inline-block;
          padding:          0;
          white-space:      pre;
        }
        span#rotor {
          animation: spinner ${speed}s linear infinite ${rstatus};
          margin-left:      ${kerning};
          margin-right:     ${kerning};
          background-color: ${bgcolor};
          ${circleBorderSpinnerCss}
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
          padding:          .191em .38em .191em .38em;
          border:           1.6pt dotted ${rtrcolor};
          border-radius:    .33em;
          color:            ${rtrcolor};
        }
      </style>
      ${markup}
    `;
  }  // end of render()

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
}
customElements.define('x-spinner', SpinnerElement);

// Enable alternative spinner with customized defaults
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

/* Some basic external functions */

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
