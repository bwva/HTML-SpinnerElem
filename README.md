# HTML-SpinnerElem

Create a customizable spinner as an HTML web component.

The spinner is constructed as a bordered circle with one or more of its border quadrants colored, rotating at a specified rate and direction.

Here is a sample page showing some variations: <a href="https://bvadata.info/html_spinner_examples.html">https://bvadata.info/html_spinner_examples.html</a>

Here are some CodePens:
- <a href="https://codepen.io/bwva/pen/PovZgEP">Spinners as List Bullet Markers</a>
- <a href="https://codepen.io/bwva/pen/wvbMZVd">Spinner Rotor Types Varied by Weight and Rotor Style</a>

## Installation

To use the spinner component in your project:
 - download and open `HTML-SpinnerElem` from GitHub;
 - from the included /src directory, move the script `spinner-component.js` to where your web scripts are located;
 - invoke the script in your HTML to load it:
```html
<script src="./MyScriptDirectory/spinner-component.js"></script>
```

## What is it?
The spinner is a custom web component that you can treat like any inline HTML tag to place a spinner in your layout.

The underlying SpinnerElement is constructed from a bit of HTML with some styling, plus css transformations to rotate it.

The spinner is created as a circle with a rotor. The rotor is just part of the circle's border, colored distinctly from the rest of the border.

SpinnerElements are self-contained, and need no additional images, css, HTML elements, frameworks, or scripts. At the same time, SpinnerElements are versatile in HTML markup and highly scriptable for dynamic applications.

## Usage
Loading the `spinner-component.js` Javascript file automatically constructs a spinner web component and makes it available as an element in the current DOM.
```html
<script src="./MyScriptDirectory/spinner-component.js"></script>
```

_Note: GitHub can't allow installation of custom web components, so no examples are embedded here. See the `/ex` directory for an HTML doc with lots of examples. I have also placed this doc online, loading the latest production version of `spinner-component.js`, at [my own site](https://bvadata.info/html_spinner_examples.html). And I've started posting CodePens with some examples._

### HTML Tag
The spinner can be placed in your HTML as an inline-block element with the following tag:
```html
<x-spinner></x-spinner>
```
The above basic spinner will inherit the text color and size of its containing element, and rotate a single border quadrant clockwise once per second.

  _Note: Custom web components always require closing tags._

In the HTML spinner tag, the usual attributes, such as `id=` or `style=`, may be assigned:
```html
<x-spinner style="font-style:italic;"></x-spinner>
```
[ Wait - _font-style_? See `prefix` and `suffix` attributes below. ]

### Scripting
A spinner element may be added programmatically by calling `new SpinnerElement` to create the spinner, and then appending the spinner to the HTML element where you want it to appear. You may use the built-in .setAttribute and .style methods to set any attributes or styles; this may be done before or after appending the spinner to the HTML.
```
const spng = document.getElementById('ElemToPutSpinnerIn');
const sp   = new SpinnerElement;
sp.setAttribute('speed','1.5');
spng.appendChild(sp);
sp.setAttribute('color','turquoise');
sp.style['font-size'] = '1em';
```
You can also programmatically assign attributes, including a name or id, to the spinner, allowing access to it from elsewhere:
```
const sp	= new SpinnerElement;
sp.setAttribute('id','spinner_01');
sp.setAttribute('name','RedSpinner');
// OR
sp.id		= 'spinner_02';  // See Note below
// etc.
```
Later...
```
for (const Sp of document.getElementsByName('RedSpinner)) {
	Sp.setAttribute('speed', '2');
}
```
  _Note: Element attributes are not always interchangeable with Javascript object properties with the same names - be careful._

Finally, the SpinnerElement comes with its own methods for setting attributes and styles:
```
const sp = new SpinnerElement;
sp.setAttributes({
 color: 'turquoise',
 prefix: 'Spinning ... ',
 cstyle: 'double'
});
sp.setStyle({
 'font-size': '2em',
 'font-weight': 'bold'
});
```

### Attributes

The spinner web component accepts a set of attributes that affect its appearance or behavior.

Each attribute has both a full and an abbreviated name; in general good programming practice calls for descriptive names; up to you - you can always refer back to this README in five years when you're trying to figure out what they mean.

Attributes specified in markup, and in options for `new SpinnerElement(options)`, are limited to the following plus `style`, `id`, `name`. Each one is described below:
```
  color | clr
  speed | sp
  direction | dir
  weight | wt
  prefix | pre
  suffix | suf
  rotor | rtr
  rotor-style | cstyle
  kerning | kern
  trace-color | tclr
  background-color | bgclr
  back-color | bkclr
```

Other attributes appropriate to inline elements may always be assigned to spinners via the built-in Javascript `setAttribute` method.

#### speed | sp = [ # ]
Controls the speed of the spinner. The value represents the time in seconds for a full rotation. Default is 1.
```html
<x-spinner speed="0.5"></x-spinner>
```

#### color | clr = [ hex color | rgba() color | inherit | transparent  ]
Sets the color of the spinner's rotor. Accepts any valid CSS color value. Default is inherit.
```html
<x-spinner color="#0000ff"></x-spinner>
```

#### trace-color | tclr = [ hex color | rgba() color | inherit | transparent ]
Sets the color of the spinner's trace. Accepts any valid CSS color value.
Default is a light gray - rgba(20, 20, 20, .1).
```html
<x-spinner trace-color="transparent"></x-spinner>
```

#### direction | dir = [ cw | ccw ]
Sets the direction of spin. Default is clockwise ('cw').
```html
<x-spinner dir="ccw"></x-spinner>
```

#### rotor | rtr = [ 1 | 11 | 101 | 111 | 1111 ]
Sets the visual form of the rotor - the part that spins around. The accepted value is up to 4 digits, each of which is a one (1) or a zero (0), representing each of the four quadrants of the circular spinner. A one (1) colors a quadrant; a zero (0) allows the trace color to show for that quadrant. '1000' would color one quadrant of the spinner. '1100' would color two adjacent quadrants, '1110' would color three adjacent quadrants, and '1010' would color opposite quadrants. '1111' would not appear to move with the default 'solid' rotor-style (below), but does show movement in some others. Ending zeroes (0) may be omitted, so '11' is the same as '1100', '101' the same as '1010'.
```html
<x-spinner rotor="101"></x-spinner>
```

#### rotor-style | cstyle = [ solid | dotted | dashed | double | ridge | groove | inset | outset ]
Sets the appearance of the rotor using the available border-types. Different spinners can be created with varying combinations of rotor-style and weight.

#### weight | wt = [ 0 .. 0.5 x cap ht | 1 .. 10 ]
Sets the weight (thickness) of the rotor and trace. This allows you to tune a spinner to the surrounding typeface, and provides varying effects in combination with other attributes. Weight may be set as a decimal fraction of the size (diameter) of the spinner; a value greater than .5 will be rejected. Weight can also be set on a size scale from 1 to 10, stepping the thickness in even increments up to just under the spinner's radius. Any other value will be rejected. Unspecified and rejected weight attributes get the default weight, .195 (= 4 on the size scale).
```html
<x-spinner weight=".12"></x-spinner>
<x-spinner weight="4"></x-spinner>
```

#### prefix | pre = [ text | HTML element ]
Adds text or an HTML element right before the spinner. The spinner is styled as an `inline-block`, so it will stay on the same line as the prefix, unless the prefix itself forces a newline. It may be necessary to provide visual space in the prefix text, if the spinner has the default 0-width kerning.
```html
<x-spinner prefix="Searching "></x-spinner>
```

#### suffix | suf = [ text | HTML element ]
Adds text or an HTML element right after the spinner. The spinner is styled as an `inline-block`, so the suffix will stay on the same line as the spinner, unless the suffix itself forces a newline. It may be necessary to provide visual space in the suffix text, if the spinner has the default 0-width kerning.
```html
<x-spinner suffix=" Recording"></x-spinner>
```

#### kerning | kern = [ length ]
Adds right and left kerning to the spinner itself - but not to any prefix or suffix. Accepts standard css length units. Default is zero (0).
TODO: Separate left and right kerning.
```html
<x-spinner prefix="Recording" suffix="Now" kern="2ch"></x-spinner>
```

#### background-color | bgclr = [ hex color | rgba() color | inherit | transparent ]
Sets the background color for the spinner only, not its prefix, suffix, or back, because the element's background-color only applies within its border.

#### back-color | bclr = [ hex color | rgba() color | inherit | transparent ]
Add a minimally-formatted background to the entire tag, including any prefix and suffix, with some padding and  rounded corners set for now by arbitrary design diktat. The background is colored with this attribute, which may be any standard HTML color. Default is no back_color, and therefore no added background, padding, etc.
Note that the spinner tag may be placed in another HTML element that provides background features, possibly with more options for styling.
MAYBE TODO: more options for the background.
```html
<x-spinner back-color="#ccccff"></x-spinner>
```

### Technical Notes

#### No dependencies - No side effects
When a web page/app loads this script (`spinner-component.js`), the spinner web component is constructed as an instance of the script's SpinnerElement class. The class contains and encapsulates all of the HTML, DOM instructions, and css needed by the spinner. No other assets are needed, and creating and using this component does not impinge on any other element or layout structure. The spinner may inherit styling from surrounding HTML, and its styling may be set programmatically. But the styling used to create the SpinnerElement, including such crucial css as `box-sizing`, will have no effect outside the spinner.

#### Fine to combine attributes
The examples above are simplified to illustrate each attribute. In practice any number or combination of attributes may be used.
```
<div style="color:#ff0000; font-size:2em;">
<x-spinner prefix="Research " suffix=" takes time." speed=".75" rotor="1110" direction="cw" back-color="#ffff00" trace-color="transparent"></x-spinner>
</div>
```
The outer `div` provides the font color and size; the attributes of the spinner include:
- `prefix="Research "` adding text before the spinner;
- `suffix=" takes time."` adding text after the spinner;
- `speed=".75"` sets the speed to one rotation every .75 seconds;
- `rotor="1110"` sets the moving part to three quadrants of the circle;
- `direction="cw"` sets the rotation to clockwise (but that's the default, so this isn't really need for clockwise);
- `back-color="#ffff00"` creates a background with that color (bright yellow) and adds padding and rounded corners to the background;
- `trace-color="transparent"` hides the spinner's trace - the non-colored quadrants of the circle, which is normally visible as a light gray.

#### Spinner Size
The spinner derives its size from whatever `font-size` applies to it. If possible it is equal to the typographic size unit `cap`, which is meant to be the height of the capital letter "H" in the font-size for the given typeface. Having the spinner sized to 1 `cap` aligns the spinner with the base line of the surrounding type, and doesn't alter the line height or the visual flow of the text line it's on. In browsers whose css doesn't recognize the `cap` unit, the SpinnerElement approximates the cap size. The idea is to make the spinner act like a character in the line it's on.

How is the `font-size` assigned to the spinner?
- the spinner tag itself may have a `style` attribute that includes a `font-size` setting;
- without its own styling, the spinner will inherit the `font-size` of its immediate containing element (and the text color as well);
- the spinner may be assigned a css selector such as a name, id or class, and then its type styling may be set from elsewhere, such as a stylesheet;
- any of the above may be accomplished from scripts as well as direct markup.

#### How is this Spinner Made?
This spinner is made from a square box with a border. One or more of the top, right, bottom, and left, borders are colored differently from the rest. Then the sides of the square are made round by giving the corners of the square a radius of 50% of its size. The result is four "quadrants" of the spinner to color and format to create different rotors.

#### The Spinner's Tag Name
The SpinnerElement class creates the spinner with the tag "x-spinner", as in the barebones spinner:
```
<x-spinner></x-spinner>
```
Custom web components have two requirements:
- tag names must start with "x-", and
- they always have a closing tag.

After creating the SpinnerElement class, `spinner-component.js` executes the command
```
customElements.define('x-spinner', SpinnerElement);
```
If "x-spinner" conflicts with some other custom element's name, or you have some other reason to use a different name, that would be where you would put your preferred name:
```
// customElements.define('x-spinner', SpinnerElement);
customElements.define('x-MySpinnerName', SpinnerElement);
```

Have Fun!
