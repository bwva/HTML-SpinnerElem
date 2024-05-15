class SpinnerElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'color', 'clr', 'speed', 'sp', 'direction', 'dir',
      'trace-color', 'tclr', 'cursor', 'crsr',
      'prefix', 'pre', 'suffix', 'suf', 'kerning', 'kern',
      'back-color', 'bclr', 'weight', 'wt'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (
         name === 'color'
      || name === 'clr'
      || name === 'speed'
      || name === 'sp'
      || name === 'direction'
      || name === 'dir'
      || name === 'trace-color'
      || name === 'tclr'
      || name === 'cursor'
      || name === 'crsr'
      || name === 'prefix'
      || name === 'pre'
      || name === 'suffix'
      || name === 'suf'
      || name === 'kerning'
      || name === 'kern'
      || name === 'back-color'
      || name === 'bclr'
      || name === 'weight'
      || name === 'wt'
    ) {
      this.render();
    }
  }

  render() {
    const crsrcolor  = this.getAttribute('color')       || this.getAttribute('clr')   || 'currentColor';
    const tracecolor = this.getAttribute('trace-color') || this.getAttribute('tclr')  || 'rgba(20, 20, 20, .1)';
    const speed      = this.getAttribute('speed')       || this.getAttribute('sp')    || '1';
    const direction  = this.getAttribute('direction')   || this.getAttribute('dir')   || 'cw';
    const kerning    = this.getAttribute('kerning')     || this.getAttribute('kern')  || '0';
    const prefix     = this.getAttribute('prefix')      || this.getAttribute('pre')   || '';
    const suffix     = this.getAttribute('suffix')      || this.getAttribute('suf')   || '';
    const bgcolor    = this.getAttribute('back-color')  || this.getAttribute('bclr')  || '';
    const cursor     = this.getAttribute('cursor')      || this.getAttribute('crsr')  || '1000';
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

    const crsr_pat     = cursor.split('');
    const top_color    = crsr_pat[0] == 1 ? crsrcolor : tracecolor;
    const left_color   = crsr_pat[1] == 1 ? crsrcolor : tracecolor;
    const bottom_color = crsr_pat[2] == 1 ? crsrcolor : tracecolor;
    const right_color  = crsr_pat[3] == 1 ? crsrcolor : tracecolor;

    let back_style;
    if (bgcolor) {
      back_style = `background-color: ${bgcolor};
          padding: .191em .38em .191em .38em;
          border-radius: .33em;
          color: ${crsrcolor};`
    }
    else {
      back_style = `background-color: transparent;
          color: inherit;`
    }

    const animation = direction === 'cw' ? 'spinner' : 'spinner_rev';

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
          display: inline-block;
          box-sizing: border-box;
          margin-left: ${kerning};
          margin-right: ${kerning};
          border-radius: 50%;
          @supports (width: 1cap) {
            width:         1cap;
            height:        1cap;
            border:        ${weight}cap solid ${tracecolor};
            border-top:    ${weight}cap solid ${top_color};
            border-bottom: ${weight}cap solid ${bottom_color};
            border-left:   ${weight}cap solid ${left_color};
            border-right:  ${weight}cap solid ${right_color};
          }
          @supports not (width: 1cap) {
            // approximation:
            width:         .7em;
            height:        .7em;
            border:        .14em solid ${tracecolor};
            border-top:    .14em solid ${top_color};
            border-bottom: .14em solid ${bottom_color};
            border-left:   .14em solid ${left_color};
            border-right:  .14em solid ${right_color};
          }
          animation: ${animation} ${speed}s linear infinite;
        }
        div {
          display:          inline-block;
          margin:           0;
          padding:          0;
          color:            ${crsrcolor};
          ${back_style}
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
