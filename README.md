# HTML-SpinnerElem

Create a customizable spinner as an HTML web component.

Here is a sample page showing some variations: <a href="https://bvadata.com/html_spinner_examples.html">https://bvadata.com/html_spinner_examples.html</a>

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

SpinnerElements are self-contained, and need no additional images, css, HTML elements, frameworks, or scripts. At the same time, SpinnerElements are versatile in HTML markup and highly scriptable for dynamic applications.

## Usage
Loading the `spinner-component.js` Javascript file automatically constructs a spinner web component and makes it available as an element in the current DOM.
```html
<script src="./MyScriptDirectory/spinner-component.js"></script>
```

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

See "Attributes" below for details.

### Scripting
A spinner element may be added programmatically by calling `new SpinnerElement` to create the spinner, and then appending the spinner to the HTML element where you want it to appear. You may use Javascript's built-in .setAttribute method to set any attributes, and the .style attribute itself to set style properties; this may be done before or after appending the spinner to the HTML.
```
const spng = document.getElementById('ElemToPutSpinnerIn');
const sp   = new SpinnerElement;
sp.setAttribute('speed','1.5');
spng.appendChild(sp);
sp.setAttribute('color','turquoise');
sp.style['font-size'] = '1em';
```
You can also programmatically assign identifiers, such as a name or id, to the spinner, allowing access to it from elsewhere:
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
 rstyle: 'double'
});
sp.setStyle({
 'font-size': '2em',
 'font-weight': 'bold'
});
```

See "Scripting API" below for details.

## Attributes

The spinner web component accepts several attributes that modify its appearance or behavior.

Each attribute has both a full and an abbreviated name; in general good programming practice calls for descriptive names. It's up to you - you can always refer back to this README in five years when you're trying to figure out what they mean.

Attributes may be specified in markup, in options for `new SpinnerElement(options)`, and programmatically. The following are available plus the standard attributes `style`, `id`, and `name`. Each attribute is described below:
```
  speed | sp
  rotor | rtr
  direction | dir
  rotor-style | rstyle
  weight | wt
  rotor-color | rclr | color
  trace-color | tclr
  background-color | bgclr
  back-color | bkclr
  prefix | pre
  suffix | suf
  kerning | kern
  rotor-status | rstatus
```
An additional set of ARIA-related attributes is available for cases when the spinner has a semantic rather than a presentational role, as decribed further below. The standard ARIA trigger `role` is duplicated for completeness below with `aria-role` and `arole`:
```
  aria-wrap | awrap
  aria-role | arole
  aria-label | albl
  aria-labelledby | albldby
  aria-busy | abusy
  aria-live | alive
  aria-description | adesc
```

Other attributes appropriate to inline elements may always be assigned to spinners via the built-in Javascript `setAttribute` method or in markup.

#### speed | sp = [ # ]
```html
  <x-spinner speed="0.5"></x-spinner>
```
Controls the speed of the spinner. The value represents the time in seconds for a full rotation. Default is 1.

#### rotor | rtr = [ 1 | 11 | 101 | 111 | 1111 ]
```html
  <x-spinner rotor="101"></x-spinner>
```
Sets the visual form of the rotor - the part that spins around. The accepted value is up to 4 digits, each of which is a one (1) or a zero (0), representing each of the four quadrants of the circular spinner. A one (1) colors a quadrant; a zero (0) allows the trace color to show for that quadrant. '1000' would color one quadrant of the spinner. '1100' would color two adjacent quadrants, '1110' would color three adjacent quadrants, and '1010' would color opposite quadrants. '1111' would not appear to move with the default 'solid' rotor-style (below), but does show movement in some others. Ending zeroes (0) may be omitted, so '11' is the same as '1100', '101' the same as '1010'.

#### direction | dir = [ cw | ccw ]
```html
  <x-spinner dir="ccw"></x-spinner>
```
Sets the direction of spin. Default is clockwise ('cw').

#### rotor-style | rstyle = [ solid | dotted | dashed | double | ridge | groove | inset | outset ]
```html
  <x-spinner rotor-style="dotted"></x-spinner>
```
Sets the appearance of the rotor using the available border-types. Different spinners can be created with varying combinations of rotor-style and weight. Default is `solid`.

#### weight | wt = [ 0 .. 0.5 | 1 .. 10 ]
```html
  <x-spinner weight=".12"></x-spinner>
  <x-spinner weight="4"></x-spinner>
```
Sets the weight (thickness) of the rotor and trace. This allows you to tune a spinner to the surrounding typeface, and provides varying effects in combination with other attributes. Weight may be set as a decimal fraction of the size (diameter) of the spinner; a value greater than .5 will be rejected. Weight can also be set on a size scale from 1 to 10, stepping the thickness in even increments up to just under the spinner's radius. Any other value will be rejected. Unspecified and rejected weight attributes get the default weight, .195 (= 4 on the size scale).

#### rotor-color | rclr | color = [ hex color | rgba() color | inherit | transparent  ]
```html
  <x-spinner color="#0000ff"></x-spinner>
```
Sets the color of the spinner's rotor. Accepts any valid CSS color value. Default is inherit.

#### trace-color | tclr = [ hex color | rgba() color | inherit | transparent ]
```html
  <x-spinner trace-color="transparent"></x-spinner>
```
Sets the color of the spinner's trace. Accepts any valid CSS color value.
Default is a light gray - rgba(20, 20, 20, .1).

#### background-color | bgclr = [ hex color | rgba() color | inherit | transparent ]
```html
  <x-spinner background-color="#ccccff"></x-spinner>
```
Sets the background color within the border of the spinner only - not its prefix, suffix, or back.

#### back-color | bkclr = [ hex color | rgba() color | inherit | transparent ]
```html
  <x-spinner back-color="#ccccff"></x-spinner>
```
Setting a back-color forces addition of a minimally-formatted background to the entire tag, including any prefix and suffix, with some padding and  rounded corners set for now by arbitrary design diktat. The background is colored with the `back-color`/`bkclr` attribute, which may be any HTML color expression. Default is no `back-color`, and therefore no added background, padding, etc.
Note that the parent element of a spinner can provide more options for styling.
MAYBE TODO: settable `back` defaults and more options for the background.

#### prefix | pre = [ text | HTML element ]
```html
  <x-spinner prefix="Searching "></x-spinner>
```
Adds text or an HTML element right before the spinner. The spinner is styled as an `inline-block`, so it will stay on the same line as the prefix, unless the prefix itself forces a newline. It may be necessary to provide visual space in the prefix text, or increase the spinner's default 0-width kerning.

#### suffix | suf = [ text | HTML element ]
```html
  <x-spinner suffix=" Recording"></x-spinner>
```
Adds text or an HTML element right after the spinner. The spinner is styled as an `inline-block`, so the suffix will stay on the same line as the spinner, unless the suffix itself forces a newline. It may be necessary to provide visual space in the suffix text, or increase the spinner's default 0-width kerning.

#### kerning | kern = [ length ]
```html
  <x-spinner prefix="Recording" suffix="Now" kern="2ch"></x-spinner>
```
Adds right and left kerning to the spinner itself - but not to any prefix or suffix. Accepts standard css length units. Default is zero (0).
TODO: Separate left and right kerning.

#### rotor-status | rstatus = [ running | paused ]
```html
  <x-spinner rotor-status="paused"></x-spinner>
```
May be used to start or stop the spinner's motion.

### ARIA-Related Attributes
In most use cases, spinners play a _presentational_ role, with no semantic meaning of their own. The context in which they are deployed provides any meaning to be detected by assistive systems such as screen readers.

For example, a "Search" button that triggers a long-running database lookup might display a message such as "Searching..." along with a spinner as a visual indicator for sighted users. When the long search process completes and returns, the button's script deletes the "Searching..." message and its spinner, and displays the search results.

The spinner in this context is passive to the action, and will no longer be available for any ARIA functionality once the long process returns. However, the display and removal of the message and spinner are events that could be detected by an ARIA-aware region, so ARIA compatibility is maintained.

By default, the SpinnerElement is constructed for this presentational role. It is composed only of `<div>` and `<span>` elements, which have no intrinsic semantic value. A screen reader voicing some text that happens to include a spinner will read right past the spinner as though it wasn't there.

Not having their own semantic roles, however, means that any text contained by `<div>` and `<span>` elements is directly available to assistive technologies. That allows a spinner's prefix and suffix to be detected and read, for example, by a screen reader.

>I think this illustrates why I like the SpinnerElement. A self-contained spinner, including its prefix and suffix, is far simpler to manage than a wait message composed of a span for the prefix, an image tag with the correct src path and styling to insert, align, and size the visual, including its 'alt' text and its own ARIA attributes to play well, and then a span for the suffix, all with their own document-wide unique ids.

#### Spinners with ARIA Roles
In some cases the spinner is part of more complex behavior. Perhaps the "Search" button above keeps the spinner displayed, but transforms its behavior, form, or prefix/suffix messages after the long process returns. Or the spinner itself could be "clickable" to trigger some event, and modifies itself when it does so. Contexts like these require providing more information and meta-data to assistive technologies.

To accommodate contexts in which changes in the spinner's state will need to be meaningful to assistive technologies, include the attribute `aria-wrap="true"` in the spinner's markup or set it programmatically. The standard spinner will then be wrapped in an additonal `<div>` element equipped with the appropriate `aria-` attributes provided by you or by default.

#### aria-wrap | awrap = [ true | false ]
If true causes the spinner to be constructed with a wrapper creating an ARIA live region around the spinner, providing access by assistive technologies. Default is 'false', leaving the spinner in a presentational role.

The SpinnerElement's available ARIA attributes include a standard set, as follows:

#### aria-role | arole = [ alert | status ]
Of all the ARIA roles, 'alert' and 'status' are relevant for spinners. Default is 'alert'.

#### aria-label | albl = [ text ]
Default is 'Current Status'.

#### aria-labelledby | albldby = [ text | reference to other elem | {prefix suffix} ]
Default is concatenated prefix suffix. May be a reference to another element in the DOM.

#### aria-description | adesc = [ text ]
Default is ''.

#### aria-busy | abusy = [ true | false ]
Default is 'true'.

#### aria-live | alive = [ polite | assertive | off ]
Default is 'polite'.

#### aria-atomic = [ true | false ]
Sets whether assistive technologies present the whole live region defined around the spinner (true) or only the changed portion. Default is 'true'.

#### aria-relevant = [ additions | removals | text | all ]
Describes the kind of change that will trigger assistive technologies. Default is 'text'.

MDN has a good **reference on ARIA attributes**, at:

[https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes)

### Fine to combine attributes
The examples above are simplified to illustrate each attribute. In practice any number or combination of attributes may be used.
```
<div style="color:#ff0000; font-size:2em;">
  <x-spinner prefix="Research " suffix=" takes time." speed=".75" rotor="1110"
  direction="cw" back-color="#ffff00" trace-color="transparent"></x-spinner>
</div>
```
The outer `div` provides the font color and size. The attributes of the spinner include:
- `prefix="Research "` adding text before the spinner;
- `suffix=" takes time."` adding text after the spinner;
- `speed=".75"` sets the speed to one rotation every .75 seconds;
- `rotor="1110"` sets the moving part to three quadrants of the circle;
- `direction="cw"` sets the rotation to clockwise (but that's the default, so this isn't really need for clockwise);
- `back-color="#ffff00"` creates a background with that color (bright yellow) and adds padding and rounded corners to the background;
- `trace-color="transparent"` hides the spinner's trace - the non-colored quadrants of the circle, which is normally visible as a light gray.

## Scripting API

The SpinnerElement provides methods for programmatically creating, deploying, and modifying spinners via Javascript.

### The SpinnerElement Class

The main spinner constructor is automatically executed when the document loads the `spinnerComponent.js` script. This creates the default spinner element and attaches it to the HTML DOM for use plain or with added attributes and styling. As described under "Attributes" above, the form and behavior of the default spinner may be entirely controlled via direct markup in the HTML. For that usage, there is no need to call `new SpinnerElement`.

>It's possible to get finely-tuned spinners that meet your needs purely by using HTML tag markup - without ever writing a line of Javascript.

You also can get programmatic access to a spinner in your HTML if it has a known name, id, or class.
```
  <x-spinner id='spinner_03'></x-spinner>

  // in some script:
  const sp = document.getElementById('spinner_03');
  sp.setAttributes( { speed: '2', color: 'green' } );
```

But sometimes the best thing is to create the spinner programmatically, so `spinnerComponent.js` enables direct instantiation with `new SpinnerElement()`. Options for the new spinner may be provided upon creation, and the spinner may then be further modified and inserted into the DOM where desired.
```
  const sp1 = new SpinnerElement( { rotor: '101', rstyle: 'double' });
  sp1.setAttribute('speed', '1.5');
  sp1.setAttribute('color', 'turquoise');
  const spng = document.getElementById('ElemToPutSpinnerIn');
  spng.appendChild(sp1);
```
Here some attributes are set in `spinOpts`, and then provided to the SpinnerElement constructor:
```
  const spinOpts = {
    rtr:           '101',
    'rotor-color': 'red',
    wt:            '2',
    tclr:          'green'
  };
  const spinner = new SpinnerElement( spinOpts );
```
Remember to quote the hypenated versions of the attribute names if you use them this way.

### Additional Functions

The spinnerComponent.js script also loads a few utility functions for use externally.

#### getSpinner( spinnerObj | spinner id | spinner name | spinner class )
Checks whether on object is a spinner or a string that references a spinner. If so, it returns the spinner; if not, it returns undefined. Note that if multiple spinners are found because the string is a class name used by multiple spinners, for example, only the first spinner is returned. See getSpinners.

#### getSpinners( spinnerObj | spinner id | spinner name | spinner class | 'x-spinner' )
Checks for valid spinners based on parameter, and returns an array of the spinner objects found. If no parameter is provided, collects spinners with the default tag name 'x-spinner', which would be ALL spinners unless others were created with `createSpinnerElement`.

#### createSpinnerElement( newSpinnerName, spinnerOptions )
The defaults for spinners may be customized, baking in your preferred attributes so it's not necessary to provide them in markup. Unless you specify otherwise, they will still assume the color and size of the text they're embedded in, like a text character would.
```
<script>
  createSpinnerElement('x-fast-revspinner', { sp: '.5', dir: 'ccw', wt: '3'});
</script>
```
This new spinner differs from the default spinner by spinning counter-clockwise, one spin per half second instead of per one second, and with weight level 3 instead of 4. Calling createSpinnerElement(name, options) adds a spinner element to the DOM, available for use in markup and programmatically. The above would provide for spinners like this, with the same capabilities as the default spinner element:
```
  <x-fast-revspinner></x-fast-revspinner>
```
Note that the above script creates a new spinner element; the original spinner with the tag name 'x-spinner' is still available.

### Spinner Methods

#### .setAttributes
Set or modify a spinner's attributes
```
  const sp  = new SpinnerElement( {} );
  sp.setAttributes({color: 'turquoise', prefix: 'Spinning ... ', rstyle: 'double' });
```
#### .setStyle
```
  const sp  = new SpinnerElement( {} );
  sp.setStyle( {'font-size': '3em'} );
```

#### .setRotor
```
  const sp  = new SpinnerElement( {} );
  sp.setRotor( 'dotted' );
```
See attributes -> rotor above for possible rotors.

#### .setWeight
```
  const sp  = new SpinnerElement( {} );
  sp.setWeight( '0.2' );
  sp.setWeight( '5' );
```
See attributes -> weight above for possible values.

#### .setPrefix
```
  const sp  = new SpinnerElement( {} );
  sp.setPrefix( 'Loading... ' );
```

#### .setSuffix
```
  const sp  = new SpinnerElement( {} );
  sp.setSuffix( ' Important!' );
```

#### .run
```
  const sp  = new SpinnerElement( {} );
  sp.run();
```
Starts a paused spinner

#### .go
```
  const sp  = new SpinnerElement( {} );
  sp.go();
```
Starts a paused spinner - same as .run()

#### .pause
```
  const sp  = new SpinnerElement( {} );
  sp.pause();
```
Pauses a running spinner

#### .stop
```
  const sp  = new SpinnerElement( {} );
  sp.stop();
```
Pauses a running spinner - same as .pause()

#### .stopGo
```
  const sp  = new SpinnerElement( {} );
  sp.stopGo();
```
Alternates between pausing and running a spinner

#### .show
```
  const sp  = new SpinnerElement( {} );
  sp.show();
```
Changes the spinner's style.display property to 'inline-block'

#### .hide
```
  const sp  = new SpinnerElement( {} );
  sp.hide();
```
Changes the spinner's style.display property to 'none'

#### .veil
```
  const sp  = new SpinnerElement( {} );
  sp.veil();
```
Changes the spinner's style.visibility property to 'hidden'

#### .unveil
```
  const sp  = new SpinnerElement( {} );
  sp.unveil();
```
Changes the spinner's style.visibility property to 'visible'

#### .toString
```
  const sp  = new SpinnerElement( {} );
  console.log( sp.toString() );
```
Returns a string encompassing the entire shadow DOM fragment of the spinner, for debugging

## Technical Notes

#### No dependencies - No side effects
When a web page/app loads this script (`spinner-component.js`), the spinner web component is constructed as an instance of the script's SpinnerElement class. The class contains and encapsulates all of the HTML, DOM instructions, and css needed by the spinner. No other assets are needed, and creating and using this component does not impinge on any other element or layout structure. The spinner may inherit styling from surrounding HTML, and its styling may be set programmatically. But the styling used to create the SpinnerElement, including such crucial css as `box-sizing`, will have no effect outside the spinner.

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
