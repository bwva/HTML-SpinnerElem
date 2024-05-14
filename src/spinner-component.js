class SpinnerElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'color', 'clr', 'speed', 'sp', 'direction', 'dir',
      'trace-color', 'tclr', 'cursor', 'crsr',
      'prefix', 'pre', 'suffix', 'suf', 'margin', 'mrgn',
      'back-color', 'bclr'
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
      || name === 'margin'
      || name === 'mrgn'
      || name === 'back-color'
      || name === 'bclr'
    ) {
      this.render();
    }
  }

  render() {
    const crsrcolor  = this.getAttribute('color') 		|| this.getAttribute('clr') 	|| 'currentColor';
    const tracecolor = this.getAttribute('trace-color')	|| this.getAttribute('tclr')	|| 'rgba(20, 20, 20, .1)';
    const speed      = this.getAttribute('speed') 		|| this.getAttribute('sp') 		|| '1';
    const direction  = this.getAttribute('direction') 	|| this.getAttribute('dir') 	|| 'cw';
    const margin     = this.getAttribute('margin') 		|| this.getAttribute('mrgn') 	|| '0';
    const prefix     = this.getAttribute('prefix') 		|| this.getAttribute('pre') 	|| '';
    const suffix     = this.getAttribute('suffix') 		|| this.getAttribute('suf') 	|| '';
    const bgcolor	 = this.getAttribute('back-color') 	|| this.getAttribute('bclr') 	|| '';
    const cursor     = this.getAttribute('cursor') 		|| this.getAttribute('crsr') 	|| '1000';

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
          margin-left: ${margin};
          margin-right: ${margin};
          border-radius: 50%;
          @supports (width: 1cap) {
            border:        .191cap solid ${tracecolor};
            border-top:    .191cap solid ${top_color};
            border-bottom: .191cap solid ${bottom_color};
            border-left:   .191cap solid ${left_color};
            border-right:  .191cap solid ${right_color};
            width:         .618cap;
            height:        .618cap;
            // .618 + (2 * .191) = 1cap-equivalent
          }
          @supports not (width: 1cap) {
            border:        .1em solid ${tracecolor};
            border-top:    .1em solid ${top_color};
            border-bottom: .1em solid ${bottom_color};
            border-left:   .1em solid ${left_color};
            border-right:  .1em solid ${right_color};
            width:         .5em;
            height:        .5em;
            // .5em + (.1em * 2) = .7em = approx cap height
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
