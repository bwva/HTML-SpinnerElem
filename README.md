# HTML-SpinnerElem

Create a customizable spinner as an HTML web component.

The spinner is constructed as a bordered circle with one, two, or three of its border quadrants colored, rotating at a specified rate and direction.

## Installation

To use the spinner component in your project:
 - download and open `HTML-SpinnerElem` from GitHub;
 - from the included /src directory, move the script `spinner-component.js` to where your web scripts are located;
 - invoke the script in your HTML to load it:
```html
<script src="./MyScriptDirectory/spinner-component.js"></script>
```

## What is it?
The spinner is a custom web component that you can treat like any inline HTML tag to place a spinner in the layout.

The underlying SpinnerElement is constructed from a bit of HTML with some styling, plus css transformations to rotate it.

For this release, the spinner is created as a circle with a cursor moving around on it. The cursor is just part of the circle's border, colored distinctly from the rest of the border.

Future spinner variants to come, from me and perhaps you!

SpinnerElements are self-contained, and need no additional images, hidden HTML elements, or scripts.

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

Note: Custom web components always require closing tags.

In the HTML spinner tag, the usual attributes, such as `id=` or `style=`, may be assigned:
```html
<x-spinner style="font-style:italic;"></x-spinner>
```
[ Wait - _font-style_? See `prefix` and `suffix` attributes below. ]

### Scripting
A spinner element may be added programmatically by calling `new SpinnerElement` to create the spinner, and then appending the spinner to the HTML element where you want it to appear. Use .setAttribute() and .style to set any attributes or styles; this may be done before or after appending the spinner to the HTML.
```
	const spng	= document.getElementById('ElemToPutSpinnerIn');
	const sp	= new SpinnerElement;
	sp.setAttribute('speed','1.5');
	spng.appendChild(sp);
	sp.setAttribute('color','turquoise');
	sp.style['font-size'] = '1em';
```
You can also programmatically assign a name or id to the spinner, allowing access to it from elsewhere:
```
	const sp	= new SpinnerElement;
	sp.setAttribute('id','spinner_01');
	sp.setAttribute('name','RedSpinner');
	// OR
	sp.id		= 'spinner_02';
	// etc.
```
Later...
```
	for (const Sp of document.getElementsByName('RedSpinner)) {
		Sp.setAttribute('speed', '2');
	}
```
### Attributes

The spinner web component accepts several attributes that affect its appearance or behavior.

Each attribute has a full and abbreviated name; in general good programming practice calls for descriptive names; up to you - you can always refer back to this README in five years when you're trying to figure out what they mean.

#### speed | sp = [ # ]
Controls the speed of the spinner. The value represents the time in seconds for a full rotation. Default is 1.
```html
<x-spinner speed="0.5"></x-spinner>
```

#### color | clr = [ hex color | rgba() color | transparent  ]
Sets the color of the spinner. Accepts any valid CSS color value. Default is inherited.
```html
<x-spinner color="#0000ff"></x-spinner>
```

#### trace-color | tclr = [ hex color | rgba() color | inherit | transparent ]
Sets the color of the spinner's trace. Accepts any valid CSS color value.
Default is a light gray - rgba(20, 20, 20, .1).
Example:
```html
<x-spinner color="#ff0000" trace-color="transparent"></x-spinner>
```
This makes the spinner red, and its trace transparent.

#### direction | dir = [ cw | ccw ]
Sets the direction of spin. Default is clockwise ('cw').
```html
<x-spinner dir="ccw"></x-spinner>
```

#### cursor | crsr = [ 1 | 11 | 101 | 111 | 1### ]
Sets the visual form of the cursor - the part that spins around. The accepted value is up to 4 digits, each of which is a one (1) or a zero (0), representing each of the four quadrants of the circular spinner. A one (1) colors a quadrant; a zero (0) allows the trace color to show for that quadrant. '1000' would color one quadrant of the spinner. '1100' would color two adjacent quadrants, '1110' would color three adjacent quadrants, and '1010' would color opposite quadrants. Ending zeroes (0) may be omitted, so '11' is the same as '1100', '101' the same as '1010'.
```html
<x-spinner cursor="101"></x-spinner>
```

#### prefix | pre = [ text | HTML element ]
Adds text or an HTML element right before the spinner. The spinner is styled as an `inline-block`, so it will stay on the same line as the prefix, unless the prefix itself forces a newline. It may be necessary to provide visual space in the prefix text, if the spinner has the default 0-width margins.
```html
<x-spinner prefix="Searching "></x-spinner>
```

#### suffix | suf = [ text | HTML element ]
Adds text or an HTML element right after the spinner. The spinner is styled as an `inline-block`, so the suffix will stay on the same line as the spinner, unless the suffix itself forces a newline. It may be necessary to provide visual space in the suffix text, if the spinner has the default 0-width margins.
```html
<x-spinner suffix=" Recording"></x-spinner>
```

#### margin | mrgn = [ length ]
Adds right and left margins to the spinner itself - but not to any prefix or suffix. Accepts standard css length units. Default is zero (0).
TODO: More options and focused names for margins.
```html
<x-spinner prefix="Recording" suffix="Now" margin="2ch"></x-spinner>
```

#### back-color | bclr = [ hex color | rgba() color | inherit | transparent ]
Add a minimally-formatted background to the entire tag, including any prefix and suffix, with some padding and  rounded corners by arbitrary design diktat. The background is colored with this attribute, which may be any standard HTML color. Default is no back_color, and therefore no added background, padding, etc.
Note that the spinner tag may be placed in another HTML element that provides background features, possibly with more options for styling.
MAYBE TODO: more options for the background.
```html
<x-spinner back-color="#ccccff"></x-spinner>
```

### Technical Notes

#### No dependencies
When a web page/app loads this script (`spinner-component.js`), the spinner web component is constructed as an instance of the script's SpinnerElem class. The class contains and encapsulates all of the HTML, DOM instructions, and css needed by the spinner. No other assets are needed, and creating and using this component does not impinge on any other scripts or styling.

#### Fine to combine attributes
The examples above are simplified to illustrate each attribute. In practice any number or combination of attributes may be used.
```
<div style="color:#ff0000; font-size:2em;">
<x-spinner prefix="Research " suffix=" takes time." speed=".75" cursor="1110" direction="cw" back-color="#ffff00" trace-color="transparent"></x-spinner>
</div>
```
The outer `div` provides the font color and size; the attributes of the spinner include:
- `prefix="Research "` adding text before the spinner;
- `suffix=" takes time."` adding text after the spinner;
- `speed=".75"` sets the speed to one rotation every .75 seconds;
- `cursor="1110"` sets the moving part to three quadrants of the circle;
- `direction="cw"` sets the rotation to clockwise (but that's the default, so this isn't really need for clockwise);
- `back-color="#ffff00"` creates a background with that color (bright yellow) and adds padding and rounded corners to the background;
- `trace-color="transparent"` hides the spinner's trace - the non-colored quadrants of the circle, which is normally visible as a light gray.

#### Spinner Size
The spinner derives its size from whatever `font-size` applies to it. If possible it is equal to the typographic size unit `cap`, which is meant to be the height of the capital letter "H" in the font-size for the given typeface. Having the spinner sized to 1 `cap` aligns the spinner with the base line of the surrounding type, and doesn't alter the line height or the visual flow of the text line it's on. In browsers whose css doesn't recognize the `cap` unit, the SpinnerElement approximates the cap size. The idea is to make the spinner act like a character in the line it's on.

How is the `font-size` assigned to the spinner?
- the spinner tag itself may have a `style` attribute that includes a `font-size` setting;
- without its own styling, the spinner will inherit the `font-size` of its immediate containing element (and the text color as well);
- the spinner may be assigned a css selector such as a name, id or class, and then its type styling may be set from elsewhere, such as a stylesheet;
- any of the above may be accomplished from scripts as well as directmarkup.

#### Cursor Thickness - In the Weeds
For this iteration, the thickness of the cursor - the border - is set by a fixed ratio to the spinner size. Fiddling with it to find what seemed to work visually at varying sizes yielded 20% of the spinner diameter - but when I added it up -  I saw .2 + .2 borders + .6 of cap left for the actual spinner, and it morphed into golden mean territory .191 + .191 + .618 = 1 cap, so that's where I left it for now.
TODO: attribute for cursor thickness, so you can tune it to the surrounding typeface.

Have Fun!
