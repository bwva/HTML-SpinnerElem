# HTML-SpinnerElem

Create a customizable spinner as an HTML web component.

The spinner is constructed as a bordered circle with one, two, or three of its border quadrants colored, rotating at a specified rate and direction.

## Installation

You can include the spinner component in your project by:
 - downloading `spinner-component.js`
 - placing it where your web scripts are located
 - invoking the script in your HTML to load it:
```html
<script src="./scripts/spinner-component.js"></script>
```

## Usage

Loading the `spinner-component.js` Javascript file automatically creates a spinner web component and makes it available in the current DOM.

The spinner web component can be placed in your HTML as an inline-block element with the following tag:

```html
<x-spinner></x-spinner>
```

The above basic spinner will take the text color and size of its "parent" element, and rotate a single border quadrant clockwise once per second.

Note: Custom web components always require closing tags.

### Attributes

The spinner web component accepts several attributes that affect its appearance or
behavior:

#### speed | sp = [ # ]
Controls the speed of the spinner. The value represents the time in seconds for a full
rotation. Default is 1.
```html
<x-spinner speed="0.5"></x-spinner>
```

#### color | clr = [ hex color | rgba() color | transparent  ]
Sets the color of the spinner. Accepts any valid CSS color value. Default is
inherited.
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
TODO: More options for margins.
```html
<x-spinner prefix="Recording" suffix="Now" margin="2ch"></x-spinner>
```

#### back-color | bclr = [ hex color | rgba() color | inherit | transparent ]
Add a minimally-formatted background to the entire tag, including any prefix and suffix, with some padding and (arbitrary design diktat) rounded corners. The background is colored with this attribute, which may be any standard HTML color. Default is no back_color, and therefore no added background, padding, etc.
Note that the spinner tag may be placed in another HTML element that provides background features, possibly with more options for styling.
MAYBE TODO: more options for the background.
```html
<x-spinner back-color="#ccccff"></x-spinner>
```

### Technical Notes

#### No dependencies
When a web page/app loads this script (`spinner-component.js`), the spinner web component is constructed as an instance of the script's SpinnerElem class. The class contains and encapsulates all of the javascript, HTML, and css needed by the spinner. No other assets are needed, and creating and using this component does not impinge on any other scripts or styling.

#### Fine to combine attributes

