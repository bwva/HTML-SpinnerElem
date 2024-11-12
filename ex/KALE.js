// KALE.js
// Prototyped agents for handling XHR and DOM interactions
// rev 7 May 2024

'use strict';

// yes, var for this one
var SUPER = (function() {
  return this || (1, eval)('this');
}());

function sourceAction(query) {
	window.location=document.location.origin
	+ document.location.pathname + '?'
	+ query;
}

function select_first(type = 'text') {
    const elements	= document.querySelectorAll(`input[type=${type}]`);
    const which_fld	= Array.from(elements).find(e => e);
    if (which_fld) {
        which_fld.focus();
    }
}

function select_first_form_input(type = 'text') {
    if (document.forms[0]) {
        for (const form of document.forms) {
            const which_fld = Array.from(form.elements).find(e => e && e.type === type);
            if (which_fld) {
                which_fld.focus();
                return;
            }
        }
    }
}

function focusItem(itm) {
    const item = itm?.id ? itm : document.getElementById(itm);
    if (item) {
		item.focus();
    }
}

function textPreview(from, to, start = '<p>', end = '</p>') {
    const fromElement = document.getElementById(from);
    const toElement = document.getElementById(to);

    if (fromElement && toElement) {
        let newText = fromElement.value;
        if (newText !== "") {
            newText = newText.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>");
            toElement.innerHTML = start + newText + end;
        } else {
            toElement.innerHTML = "";
        }
    }
}

// Substitute for a common function
function $(id) {
    if (typeof id === "string") {
        const item = document.getElementById(id);
        return item;
    }
    return id;
}

function trainChars (str,carLen) {
    let origStr     = str;
    const chunkLen    = carLen;
    let pos         = 0;
    const trainer     = function() {
        origStr += origStr;
        pos++;
        return origStr.substring(pos,chunkLen+pos);
    };
    return trainer;
}

// Direct DOM Manipulation
function addDomElem(parentElemId, elemClass, elemType, elemID) {
    const newDomElem = document.createElement(elemClass);
    if (elemType) {
        newDomElem.type = elemType;
    }
    const DomParent = document.getElementById(parentElemId);
    if (DomParent) {
        DomParent.appendChild(newDomElem);
        if (elemID) {
            newDomElem.id = elemID;
        }
        return newDomElem;
    }
}

// Direct DOM Manipulation
function deleteDomElem(elemId, parentElemId) {
    const DomElem = document.getElementById(elemId);
    if (!DomElem) { return; }
    let DomParent	= document.getElementById(parentElemId);
    DomParent		??= DomElem.parentNode;
    if (DomParent) {
        DomParent.removeChild(DomElem);
    }
    return DomElem;
}

function removeDomElem(elemId,parentElemId) {
    const DomElem     = document.getElementById(elemId);
    if (!DomElem) { return; }
    let DomParent	= document.getElementById(parentElemId);
    DomParent		??= DomElem.parentNode;
    DomParent.removeChild(DomElem);
    return DomElem;
}

function registerEvent(tgt, evt, fcn, capture) {
    const DomElem = $(tgt);
    if (!DomElem) { return; }
    DomElem.addEventListener(evt, fcn, Boolean(capture));
    return fcn; // return the function for use by unRegisterEvent
}

function registerEventByClass(className, evt, fcn, capture) {
    const elems = document.getElementsByClassName(className);
    const num = elems.length;
    for (let i = 0; i < num; i++){
        const DomElem = elems[i];
        DomElem.addEventListener(evt, fcn, Boolean(capture));
    }
    return fcn; // return the function for use by unRegisterEvent
}

// tagName may include type - e.g., input:checkbox [no spaces around ':']
function registerEventByTag(tagName, evt, fcn, capture) {
    const taggage	= tagName.split(':');
    const ourTag	= taggage[0];
    const ourType	= taggage[1] || 'all';
    const elems		= document.getElementsByTagName(ourTag);
    const num		= elems.length;
    if (num === 0) { return; }
    for (let i = 0; i < num; i++){
        const DomElem = elems[i];
        if (DomElem.type === ourType || ourType === 'all') {
            DomElem.addEventListener(evt, fcn, Boolean(capture));
        }
    }
    return fcn; // return the function for use by unRegisterEvent
}

// fcn MUST be a reference to the callback that was
// registered with the target for the named event (evt)
// I.e., not just the same function.
// Updated registerEvent functions above now return the fcn
//		let myFunction = function() { /* do something */ };
//		myFunction = registerEvent(myElement, 'click', myFunction, false);
//		// later...
//		unRegisterEvent(myElement, 'click', myFunction, false);
function unRegisterEvent(tgt,evt,fcn,capture) {
    const DomElem     = $(tgt);
    if (!DomElem) { return undefined; }
    const eventName   = evt;
    const eventFcn    = fcn;
    const eventCapt   = capture ? true : false;
    DomElem.removeEventListener( eventName, eventFcn, eventCapt );
}


// DOC Methods
// These use the core executable object constructor -- call with "new AgentExec (url)".
// See AgentExec prototypes below for methods.

// doc - main DOC method
function doc(OKProcs = [], errProcs = [], preProcs = [], postProcs = [], uniqueAgent) {
    let agent;
    if (uniqueAgent) {
        agent  = new AgentExec();
    } else {
        if (!SUPER.docAgent) {
            SUPER.docAgent = new AgentExec();
        }
        agent  = SUPER.docAgent;
    }

    try {
        agent.process(preProcs);
    } catch (e) {
        errProcs.unshift({'fcn':'xhrReportErr', 'val':'Document Pre-Processing Failure: ' + e + '.'});
        agent.process(errProcs);
        return agent;
    }

    try {
        agent.process(OKProcs);
    } catch (e) {
        errProcs.unshift({'fcn':'xhrReportErr', 'val':'Document Processing Failure: ' + e + '.'});
        agent.process(errProcs);
        return agent;
    }

    if (postProcs) {
        try {
            agent.process(postProcs);
        } catch (e) {
            errProcs.unshift({'fcn':'xhrReportErr', 'val':'Document Post-Processing Failure: ' + e + '.'});
            agent.process(errProcs);
            return agent;
        }
    }

    return agent;
}

function docValue (fcn,tgt,val) {
    //return doc([{'fcn':fcn,'tgt':tgt,'val':val}]);
    return doc([{'fcn':fcn,'tgt':tgt,'val':val}]).returnVals[0];
}

function docStyle (fcn,tgt,sel,val) {
    return doc([{'fcn':fcn,'tgt':tgt,'sel':sel,'val':val}]);
}

function docNode (fcn,tgt,ElemClass,NodeID,NodeName) {
    return doc([{'fcn':fcn,'tgt':tgt,'val':ElemClass,'setId':NodeID,'setName':NodeName}]);
}

// Set or append values in DOM elements
function setV (item,vals,mode,sep) {
    if (!item) { return ""; }
    const whichItem   = String( item.type || item.tagName ).toUpperCase();
    const append      = (mode === '+' || mode === 'add') ? true : false;
    const newVals     = (vals) ? vals : [""];
    let oldVals     = [];
    const appendSep	= (sep) ? sep : ' ';
    const appendBrk	= (sep) ? sep : "<br />\n";
    switch ( whichItem ) {
        case 'TEXT':
        case 'COLOR':
        case 'SEARCH':
        case 'EMAIL':
        case 'HIDDEN':
        case 'TEXTAREA':
        case 'PASSWORD':
            oldVals = [item.value];
            item.value  = (append && oldVals[0]) ? oldVals[0] + appendSep + newVals[0] : newVals[0];
            return item.value;
        case 'BUTTON':
        case 'SUBMIT':
        case 'LI':
        case 'DT':
            oldVals = [item.innerHTML];
            item.innerHTML  = (append && oldVals[0]) ? oldVals[0] + appendSep + newVals.join(appendSep) : newVals.join(appendSep);
            return item.innerHTML;
        case 'SELECT-ONE':
        	len = item.options.length;
        	let i = 0;
            for (i; i < len; i++) {
                if (item.options[i].value === newVals[0]) {
                    item.selectedIndex  = i;
                    break;
                }
            }
            if (i===len) {
                item.options[i] = new Option();
                item.options[i].value = newVals[0] || '';
                item.options[i].text = newVals[0] || 'Select One';
                item.options[i].selected = true;
            }
            return newVals[0];
        case 'SELECT-MULTIPLE':
            if (!append) { item.selectedIndex   = -1; }
            len = newVals.length;
            const ilen = item.options.length;
            for (let v=0; v < len; v++) {
                for (let i=0; i < ilen; i++) {
                    if (item.options[i].value === newVals[v]) {
                        item.options[i].selected = true;
                    }
                }
            }
            return newVals;
        case 'CHECKBOX':
            oldVals = [item.checked];
            item.checked    = (newVals[0]) ? true : false;
            return item.checked;
        case 'RADIO':
            const thisRadio   = (item.form) ? item.form.elements[item.name] : document.getElementsByName(item.name);
            if (newVals[0] === '-') {
            	len = thisRadio.length;
                for (let i=0; i < len; i++) {
                    thisRadio[i].checked = false;
                }
            } else {
            	len = thisRadio.length;
                for (let i=0; i < len; i++) {
                if (thisRadio[i].value === newVals[0]) {
                    thisRadio[i].checked = true;
                    break;
                    }
                }
            }
            return newVals[0];
        case 'P':
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
        case 'FORM':
        case 'SPAN':
        case 'DIV':
        case 'BLOCKQUOTE':
        case 'DD':
            oldVals = [item.innerHTML];
            item.innerHTML  = (append && oldVals[0]) ? oldVals[0] + appendBrk + newVals.join(appendBrk) : newVals.join(appendBrk);
            return item.innerHTML;
        default:
            return "";
    }
}

// set value of an HTML element identified by id
function setItemValue (id,val) {
    let item = document.getElementById(id);
    return item && setV(item, Array.isArray(val) ? val : [val]);
}

// set value of an HTML element identified by its name attribute
// Applies only to the first element found with the specified name
function setNamedItemValue (name,val) {
    let item = document.getElementsByName(name)[0];
    return item && setV(item, Array.isArray(val) ? val : [val]);
}

function appendItemValue (id,val) {
    let item = document.getElementById(id);
    return item && setV(item, [val], '+');
}

function clearItem (id) {
    let item = document.getElementById(id);
    return item && setV(item, ['']);
}

function fadeClearItem (id) {
    let item = document.getElementById(id);
    if (item) {
        item.style.color = "#999";
        setTimeout(function(){item.style.color = "#CCC";},1000);
        return setV(item, ['']);
    }
}

function copyData (fld,type,src){
    if (!src) {return undefined;}
    const typeStr = String(type);
    let setVal  = $(src) ? $(src).innerHTML : '_NO_SRC_';
    if (setVal === '_NO_SRC_') {return undefined;}
    const fldStr = String(fld);
    const fldName = fldStr.split(/(?: |:|_)/);
    if (!fldName[1]) {
        fldName[1] = fldName[0];
        fldName[0] = 'SUP';  // ***
    }
    const db	= fldName.shift();
    const dbfld = fldName.join("_");
    if (typeStr.match(/^(t|n|a)$/)) {
        setItemValue(db+'_'+dbfld,setVal);
    } else if (typeStr.match(/^(c|b)$/)) {
        if (setVal === 0) {setVal='';}
        setItemValue(db+'_'+dbfld,setVal);
    } else if (typeStr.match(/^(r|rset)$/)) {
        if (setVal === '') {setVal='-';}
        setItemValue(document.forms.CompForm.elements[dbfld+'_'+db][0].id,setVal);
    } else if (typeStr.match(/^(pop)$/)) {
        setItemValue(db+'_'+dbfld+'Select',setVal);
    } else if (typeStr.match(/^(d)$/)) {
        let date = String(setVal);
        let dateParts = date.split('-',3);
        dateParts[0] = (Number(dateParts[0])>0) ? dateParts[0] : 'Year';
        dateParts[1] = (Number(dateParts[1])>0) ? ['January','February','March','April','May','June','July','August','September','October','November','December'][dateParts[1]-1] : 'Month';
        dateParts[2] = (Number(dateParts[2])>0) ? Number(dateParts[2]) : 'Day';
        setItemValue(db+'_'+dbfld+'_yrSelect',dateParts[0]);
        setItemValue(db+'_'+dbfld+'_monSelect',dateParts[1]);
        setItemValue(db+'_'+dbfld+'_daySelect',dateParts[2]);
    } else {
        SUPER.alert('unknown data type');
    }
    return setVal;
}

// Get values from DOM elements
function getV (item) {
    if (!item || item === null) {
        return { 'vals':[""], 'srcStat':['Error', 'No item.'] };
    }
    const itemRef   = item.type || item.tagName || '';
    if (!itemRef || itemRef === null) {
        return { 'vals':[""], 'srcStat':['Error', 'Unknown item.'] };
    }
    const whichItem   = String( itemRef ).toUpperCase();
    let itemVals	= [""];
    switch ( whichItem ) {
        case 'TEXT':
        case 'COLOR':
        case 'SEARCH':
        case 'EMAIL':
        case 'HIDDEN':
        case 'TEXTAREA':
        case 'PASSWORD':
        case 'BUTTON':
            itemVals    = [item.value];
            break;
        case 'SELECT-ONE':
            itemVals    = (item.selectedIndex > -1) ? [ item.options[item.selectedIndex].value || item.options[item.selectedIndex].text ] : [""];
            break;
        case 'SELECT-MULTIPLE':
            let idx         = 0;
            const itemArray   = [];
            let len		= item.options.length;
            for (let i = 0; i < len; i++) {
                if (item.options[i].selected) {
                    itemArray[idx] = (item.options[i].value) ? item.options[i].value : item.options[i].text;
                    idx++;
                }
            }
            itemVals    = [itemArray.join(',')];
            break;
        case 'CHECKBOX':
            itemVals    = item.checked ? [1] : [0];
            break;
        case 'RADIO':
            const thisRadio = (item.form) ? item.form.elements[item.name] : document.getElementsByName(item.name);
            let rlen		= thisRadio.length;
            for (let i = 0; i < rlen; i++) {
                if (thisRadio[i].checked) {
                    itemVals    = [thisRadio[i].value];
                    break;
                }
            }
            break;
        case 'P':
        case 'H':
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
            itemVals    = [item.innerText];
            break;
        case 'DIV':
        case 'SPAN':
        case 'FORM':
            itemVals    = [item.innerHTML];
            break;
        default:
            return { 'vals':itemVals, 'srcStat':['Error', 'Unknown item reference: ' + whichItem] };
    }
    return { 'vals':itemVals, 'srcStat':['OK', whichItem] };
}

// Form values
function formParams(formId) {
    let form = document.getElementById(formId);
    let formData = new FormData(form);
    let params = '';
    for (let [key, value] of formData.entries()) {
        params += key + '=' + encodeURIComponent(value) + ';';
    }
    return params;
}

// Specified Form Values
function formSpecifiedParams (form, fldList, multi) {
    if (!form || !form.elements.length || !fldList || !fldList.length) { return ''; }
    let found;
    return Array.from(form.elements).reduce((params, element) => {
        if (element.name && fldList.includes(element.name) && (multi || !found[element.name])) {
            found[element.name] = true;
            params += element.name + '=' + encodeURIComponent(getV(element).vals[0]) + ';';
        }
        return params;
    }, '');
}

// get single value from an HTML element identified by id
// (first only if source returns multiple values)
function getItemValue (id) {
    let item = document.getElementById(id);
    if (item) {
        let ret = getV(item);
        if (ret.srcStat[0] === 'OK') {
            return ret.vals[0];
        }
    }
    return "";
}

// get multiple values from an HTML element identified by id
function getItemValues (id) {
    let item = document.getElementById(id);
    if (item) {
        let ret = getV(item);
        if (ret.srcStat[0] === 'OK') {
            return ret.vals;
        }
    }
    return [];
}

// get single value from an HTML element identified by its name attribute
// (first only if source returns multiple values)
function getNamedItemValue (name) {
    let item    = document.getElementsByName(name)[0];
    if (item) {
        let ret = getV(item);
        if (ret.srcStat[0] === 'OK') {
            return ret.vals[0];
        }
    }
    return "";
}

function getNamedItemValues (name) {
    let item    = document.getElementsByName(name)[0];
    if (item) {
        let ret = getV(item);
        if (ret.srcStat[0] === 'OK') {
            return ret.vals;
        }
    }
    return [];
}

function getElemValue (tag, idx = 0) {
    let item = document.getElementsByTagName(tag)[idx];
    if (item) {
        let ret = getV(item);
        if (ret.srcStat[0] === 'OK') {
            return ret.vals[0] || "";
        }
    }
    return "";
}

function getElemValues (tag, idx = 0) {
    let item = document.getElementsByTagName(tag)[idx];
    if (item) {
        let ret = getV(item);
        if (ret.srcStat[0] === 'OK') {
            return ret.vals;
        }
    }
    return [];
}

// randomize items
// See Fisher-Yates shuffle:
function shuffleValues(tgt, sep = '\n') {
    const deck = getItemValue(tgt);
    if (!deck) { return; }
    let list = deck.split(sep);
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    setV($(tgt), [list.join(sep)]);
}

// Cascade Contructor  call with new Cascade(tgt,src,pause,len,sep,initColor)
function Cascade (tgt, src, pause, len, sep = '<br> ',initColor = "#000000") {
    this.tgt        = tgt;
    this.src        = src;
    this.pause      = pause;
    this.len        = len;
    this.sep        = (sep) ? sep : '<br> ';
    this.initColor  = initColor;
}

// Cascade Action
Cascade.prototype.go = function() {
    let names		= document.getElementById(this.src).innerHTML;
    let name_list   = names.split(" |");
    let thisName    = name_list.pop();
    name_list.unshift(thisName);
    let rev_names   = name_list.join(" |");
    let show_names  = name_list.slice(0,this.len);
    show_names[0]   = "<span id='first_scroll' class='scroll_first'>" + show_names[0] + '<\/span>';
    let new_str     = show_names.join(this.sep);
    setV($(this.tgt), [new_str]);
    setV($(this.src), [rev_names]);

    // $(this.tgt).style.color = this.initColor;
    // setTimeout(function(){$(this.tgt).style.color   = "#000000";},1000);
};

// Cascade Factory
function cascader (tgt,src,pause,len,sep,initColor) {
    const cascade         = new Cascade(tgt,src,pause,len,sep,initColor);
    function goNow() {
        cascade.go();
        setTimeout(goNow,cascade.pause);
    }
    return goNow;
}

// set a style property of an HTML element identified by id
function setItemStyle (id, prop, val) {
    let item = document.getElementById(id);
    if (item && prop in item.style) {
        item.style[prop] = val;
        return val;
    }
    return;
}

function setItemDisabledState(item, disabled = true) {
    if (!item) { return; }
    const whichItem = String(item.type || item.tagName).toUpperCase();
    const validItems = [
        'SUBMIT', 'TEXT', 'COLOR', 'TEXTAREA',
        'PASSWORD', 'BUTTON', 'SELECT-ONE',
        'SELECT-MULTIPLE', 'CHECKBOX', 'RADIO', 'FIELDSET'
    ];

    if (validItems.includes(whichItem)) {
        item.disabled = disabled;
        return true;
    }
    return false;
}

function disableItem(item) {
	return setItemDisabledState(item,true);
}
function enableItem(item) {
	return setItemDisabledState(item,false);
}

function getMeta() {
    let docMeta	= {};
    const metaElements = document.querySelectorAll('meta');

    metaElements.forEach((metaElement, index) => {
        let metaItem = metaElement.content;
        let metaName = metaElement.name || metaElement.httpEquiv || '';

        if (metaItem || metaName) {
            metaName = metaName ? metaName : 'x-' + index;
            docMeta[metaName] = metaItem !== null ? metaItem : '';
        }
    });

    return docMeta;
}

function getDeepMeta() {
    let deepMeta	= {};
    let sharedMeta	= {};
    const metaElements = document.querySelectorAll('meta');

    metaElements.forEach((metaElement) => {
        for (let subname in metaElement) {
            if (metaElement[subname]) {
                let stype = typeof metaElement[subname];
                if (stype === 'string') {
                    let kw = subname + ':' + metaElement[subname];
                    sharedMeta[kw] = 1;
                }
            }
        }
    });

    metaElements.forEach((metaElement, index) => {
        let metaItem = metaElement.content;
        let metaName = metaElement.name || metaElement.httpEquiv || '';

        if (metaItem || metaName) {
            metaName = metaName ? metaName : 'x-' + index;
            metaItem = metaItem !== null ? metaItem : '';
        }

        if (metaName) {
            deepMeta[metaName] = metaItem;

            for (let subname in metaElement) {
                let stype = typeof metaElement[subname];
                if (stype === 'string') {
                    let kw = subname + ':' + metaElement[subname];
                    if (sharedMeta[kw]) {
                        deepMeta[metaName + ':' + subname] = metaElement[subname];
                    }
                }
            }
        }

    });

    return deepMeta;
}

function getDeepMetaObj() {
    let deepMeta	= {};
    let sharedMeta	= {};
    const metaElements = document.querySelectorAll('meta');

    metaElements.forEach((metaElement) => {
        for (let subname in metaElement) {
            if (metaElement[subname]) {
                let stype = typeof metaElement[subname];
                if (stype === 'string') {
                    let kw = subname + ':' + metaElement[subname];
                    sharedMeta[kw] = 1;
                }
            }
        }
    });

    metaElements.forEach((metaElement, index) => {
        let metaItem = metaElement.content;
        let metaName = metaElement.name || metaElement.httpEquiv || '';

        if (metaItem || metaName) {
            metaName = metaName ? metaName : 'x-' + index;
            metaItem = metaItem !== null ? metaItem : '';
        }

        if (metaName) {
            deepMeta[metaName] = {
                'metaItemValue': metaItem,
                'toString': function() {
                    return this.metaItemValue;
                },
            };

            for (let subname in metaElement) {
                let stype = typeof metaElement[subname];
                if (stype === 'string') {
                    let kw = subname + ':' + metaElement[subname];
                    if (sharedMeta[kw]) {
                        deepMeta[metaName][subname] = metaElement[subname];
                    }
                }
            }
        }
    });

    deepMeta.toString = function(item) {
        return deepMeta[item].metaItemValue;
    }
    return deepMeta;
}

// Get document keywords, returned as an array
function getMetaKeywords () {
    return getMeta().keywords || [];
}

// Get document description, returned as an array
function getMetaDescription () {
	return getMeta().description || [];
}

function getEventTarget (evt) {
    return evt.target || evt.currentTarget || evt.srcElement;
}

function sendEvent(evt = 'click',tgt) {
	const what	= new Event(evt);
	const who	= tgt.id ? tgt : document.getElementById(tgt);
	if (who && what) {
		who.dispatchEvent(what);
	}
}

// XHR Methods
// The core XHR executable object constructor -- call with "new AgentExec ()".
// See prototypes below for methods.
function AgentExec () {
    // Initial values for the executable object
    this.statusText    = "INIT";
    this.returnVals    = [];
    this.msg           = "";
    this.err           = "";
}

// Main XHR Request method
function xhr(
		method			= 'GET',
		reqSync,
		params,
		reqOKProcs		= [{'fcn':'xhrReportMsg', 'val':' OK. '}],
		preProcs		= [],
		postProcs		= [],
		reqTime,
		reqTimeProcs,
		noReqProcs		= [{'fcn':'xhrReportErr', 'val':'No Request Object Available.'}],
		noExecProcs		= [{'fcn':'xhrReportErr', 'val':'No Remote Executable:'}],
		uniqueAgent
	) {
    let agent;
    if (uniqueAgent) {
        agent  = new AgentExec();
    } else {
        if (!SUPER.xhrAgent) {
            SUPER.xhrAgent = new AgentExec();
        }
        agent  = SUPER.xhrAgent;
    }
    if (!agent.getExec()) {
        agent.statusText = "ERR";
        agent.process(noExecProcs);
        return agent;
    }
    if (!agent.getXHRequest()) {
        agent.process(noReqProcs);
        return agent;
    }
    const aSync     = (reqSync) ? false : true;
    params          += '_t='+new Date().getTime()+';';
    preProcs.unshift({'fcn':'xhrReportMsg', 'val':' Ready (' + agent.dom + ')'});
    reqTime         = (reqTime && reqTime>0) ? reqTime : 90000;
    reqTimeProcs    = (reqTimeProcs) ? reqTimeProcs : [{'fcn':'xhrAbort', 'val':'HTTP Request Timed Out with ' + params}];
    agent.process(preProcs);
    agent.timeout   = setTimeout(function () {
        agent.process(reqTimeProcs);
    }, reqTime);
    agent.request.onreadystatechange = function () {
        if (agent.request.readyState === 4) {
            agent.msg  += agent.request.readyState;
            clearTimeout(agent.timeout);
            if (agent.request.status === 200) {
                if (aSync) {
                    agent.process(reqOKProcs);
                }
            } else {
                agent.err  += "Retrieval failure: " + ((agent.request.statusText) ? agent.request.statusText : 'unknown reason.') + " ";
            }
        } else {
            agent.msg  += agent.request.readyState + " - ";
        }
    };
    let url;
    switch (method) {
        case 'GET':
            url =   agent.makeExecURL(params);
            agent.request.open("GET", url, aSync);
            if (agent.request.readyState === 1) {
                agent.request.setRequestHeader("Cache-Control", "no-cache");
                try {
                    agent.request.send(null);
                } catch (e) {
                    SUPER.alert(url+'\n'+e);
                }
                if (!aSync) {
                    agent.process(reqOKProcs);
                }
            }
            break;
        case 'POST':
            url =   agent.makeExecURL();
            agent.request.open("POST", url, aSync);
            if (agent.request.readyState === 1) {
                agent.request.setRequestHeader("Cache-Control", "no-cache");
                agent.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                agent.request.send(params);
                if (!aSync) {
                    agent.process(reqOKProcs);
                }
            }
            break;
        case 'HEAD':
            url =   agent.makeExecURL(params);
            agent.request.open("HEAD", url, aSync);
            if (agent.request.readyState === 1) {
                agent.request.send(null);
                if (!aSync) {
                    agent.process(reqOKProcs);
                }
            }
            break;
        case 'PUT':
            agent.err  += "Unsupported http request method: PUT";
            agent.statusText = "ERR";
            break;
        default:
            agent.err  += "Unknown http request method: " + method;
            agent.statusText = "ERR";
            break;
    }
    if (postProcs) {
        agent.process(postProcs);
    }
    return agent;
}

// XHR GET
function xhrGet(action, args, OKprocs, verbose, preProcs, postProcs, reqTime) {
    let params	= action ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    const timeLimit = (reqTime && reqTime > 0) ? reqTime : 90000;
    const requestor = xhr('GET', 0, params, OKprocs, preProcs, postProcs, timeLimit);
    const outcome = requestor.execResult();
    if (verbose) {
        let message = outcome.statusText + " - ";
        if (outcome.statusText === 'XML') {
            message += outcome.returnVals + " - ";
        }
        message += outcome.err || outcome.msg;
        SUPER.alert(message);
    }

    return outcome.statusText === 'ERR' || outcome.statusText === 'INIT' ? true : false;
}

function xhrSetSrc(object,action,args,OKProcs,preProcs = [],postProcs,uniqueAgent) {
    let params	= action ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    OKProcs         = (OKProcs) ? OKProcs : [{'fcn':'xhrReportMsg', 'val':'Source loaded OK'}];
    preProcs.unshift({'fcn':'setItemSrc','tgt':object});
    xhr('GET',1,params,objProcs,OKProcs,preProcs,postProcs,uniqueAgent);
    return false;
}

// XHR RETRIEVE
 function xhrRetrieve(action,args,OKprocs,verbose,preProcs,postProcs) {
    let params  = (action) ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params      += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    const requestor = xhr('GET',1,params,OKprocs,preProcs,postProcs);
    const outcome = requestor.execResult();
    if (verbose) {
        let message = outcome.statusText + " - ";
        if (outcome.statusText === 'XML') {
            message += outcome.returnVals + " - ";
        }
        message += outcome.err || outcome.msg;
        SUPER.alert(message);
    }
    return requestor.xhrText();
}

 function xhrRetrieveHead(action,args,OKprocs,verbose,preProcs,postProcs) {
    let params  = (action) ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params      += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    const requestor = xhr('HEAD',1,params,OKprocs,preProcs,postProcs);
    const outcome = requestor.execResult();
    if (verbose) {
        let message = outcome.statusText + " - ";
        if (outcome.statusText === 'XML') {
            message += outcome.returnVals + " - ";
        }
        message += outcome.err || outcome.msg;
        SUPER.alert(message);
    }
    return requestor.xhrHdr();
}

// XHR META
 function xhrAction(action,args,OKprocs,verbose) {
    let params  = (action) ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params      += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    const requestor = xhr('GET',0,params,OKprocs);
    const outcome = requestor.execResult();
    if (verbose) {
        let message = outcome.statusText + " - ";
        if (outcome.statusText === 'XML') {
            message += outcome.returnVals + " - ";
        }
        message += outcome.err || outcome.msg;
        SUPER.alert(message);
    }
    return requestor.makeExecURL(params);
}

// XHR FCN
 function xhrFcn(action,args,OKprocs,verbose,preProcs,postProcs,reqTime) {
    let params  = (action) ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params      += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    const timeLimit	= (reqTime && reqTime>0) ? reqTime : 90000;
    const requestor	= xhr('GET',true,params,OKprocs,preProcs,postProcs,timeLimit,[],[],[],1);
    const outcome = requestor.execResult();
    if (verbose) {
        let message = outcome.statusText + " - ";
        if (outcome.statusText === 'XML') {
            message += outcome.returnVals + " - ";
        }
        message += outcome.err || outcome.msg;
        SUPER.alert(message);
    }
    const result_obj= requestor.xhrObject(); // ***
	let result_fcns	= (result_obj.fcns) ? result_obj.fcns :
		(result_obj.length > 0 && (result_obj[0].fcn)) ? result_obj :
		[{"fcn":"updateItem", "tgt":"xhr_msg", "val":"No functions returned."}];
    let resultValFcn;
	if ('val' in result_obj) {
	    let result_value	= String(result_obj.val || '');
		resultValFcn = function(){ return setV(this.getItem(), [result_value]); };
	} else {
		resultValFcn = function(){ return setV(this.getItem(), [ getV(this.getItem()) || '*****' ]); };
	}
	requestor.resultVal = resultValFcn;
    requestor.process(result_fcns);
    return false;
}

// XHR FORM FCN
 function xhrFormFcn(action,args,form,OKprocs,verbose,preProcs,postProcs,reqTime) {
    let params  = (action) ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params      += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    if (form) {
        let formVals    = "";
        const len = form.elements.length;
        for (let i = 0; i < len; i++) {
            if (form.elements[i].name) {
                formVals += form.elements[i].name + "=" + encodeURIComponent(getV(form.elements[i]).vals[0]) + ";";
            }
        }
        if (formVals) { params += formVals; }
    }
    const timeLimit	= (reqTime && reqTime>0) ? reqTime : 90000;
    const requestor	= xhr('POST',1,params,OKprocs,preProcs,postProcs,timeLimit,[],[],[],1);
    const outcome = requestor.execResult();
    if (verbose) {
        let message = outcome.statusText + " - ";
        if (outcome.statusText === 'XML') {
            message += outcome.returnVals + " - ";
        }
        message += outcome.err || outcome.msg;
        SUPER.alert(message);
    }
    const result_obj	= requestor.xhrObject();
    const result_fcns	= (result_obj.fcns) ? result_obj.fcns :
        (result_obj.length > 0 && (result_obj[0].fcn)) ? result_obj :
        [{"fcn":"updateItem", "tgt":"xhr_msg", "val":"No functions returned."}];
    requestor.process(result_fcns);
    return false;
}
                // action,args,OKprocs,interval,verbose,preProcs,postProcs
function xhrRefreshFcn(action,args,OKprocs,interval,verbose,preProcs,postProcs) {
    let params  = (action) ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params      += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";

    let cntr    = 0;  // needed to force browser refresh
    const fcn     = function(){
        cntr++;
        const requestor = xhr('GET',1,params+'cntr='+cntr,OKprocs,preProcs,postProcs,'',[],[],[],1);
		const outcome = requestor.execResult();
		if (verbose) {
			let message = outcome.statusText + " - ";
			if (outcome.statusText === 'XML') {
				message += outcome.returnVals + " - ";
			}
			message += outcome.err || outcome.msg;
			SUPER.alert(message);
		}
        const result_obj = requestor.xhrObject();
        const result_fcns = (result_obj.fcns) ? result_obj.fcns :
            (result_obj.length>0 && (result_obj[0].fcn)) ? result_obj :
            [{"fcn":"updateItem", "tgt":"xhr_msg", "val":"No functions returned."}];
        requestor.process(result_fcns);
    };
    return SUPER.setInterval(fcn,interval);
}

// XHR OBJ
function xhrObj(action,args,OKprocs,verbose,preProcs,postProcs) {
    let params  = (action) ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params      += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    const noProcs = [];
    preProcs    = (preProcs) ? preProcs : [];
    const requestor = xhr('GET',1,params,noProcs,preProcs,postProcs);
    const outcome = requestor.execResult();
    if (verbose) {
        let message = outcome.statusText + " - ";
        if (outcome.statusText === 'XML') {
            message += outcome.returnVals + " - ";
        }
        message += outcome.err || outcome.msg;
        SUPER.alert(message);
    }
    const result_obj= requestor.xhrObject();
    requestor.result_val    = (result_obj.val) ? result_obj.val : "";
    const result_fcns = (result_obj.fcns) ? result_obj.fcns : [{'fcn':'updateItem', 'tgt':'xhr_msg', 'val':'No object functions returned.'}];
    const fcns        = OKprocs;
    let fcn_list    = fcns.concat(result_fcns);
    requestor.process(fcn_list);
    return false;
}

// XHR LINK
function xhrLink(action,args,OKprocs,verbose,preProcs,postProcs) {
    let params  = (action) ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params      += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    const requestor = xhr('GET',1,params,OKprocs,preProcs,postProcs);
    const outcome = requestor.execResult();
    if (verbose) {
        let message = outcome.statusText + " - ";
        if (outcome.statusText === 'XML') {
            message += outcome.returnVals + " - ";
        }
        message += outcome.err || outcome.msg;
        SUPER.alert(message);
    }
    return undefined; // void(0);
}

// XHR REFRESH
function xhrRefresh(action,args,OKprocs,interval,verbose,preProcs,postProcs) {
    let params  = (action) ? 'action=' + encodeURIComponent(action) + ';' : "";
    interval    = (interval) ? interval : 1000;
    if (args) { params += args + ';'; }
    params      += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    let cntr    = 0;  // needed to force browser refresh
    const fcn     = function(){
        cntr++;
        const requestor = xhr('GET',1,params+'cntr='+cntr,OKprocs,preProcs,postProcs,'',[],[],[],1);
		const outcome = requestor.execResult();
		if (verbose) {
			let message = outcome.statusText + " - ";
			if (outcome.statusText === 'XML') {
				message += outcome.returnVals + " - ";
			}
			message += outcome.err || outcome.msg;
			SUPER.alert(message);
		}
    };
    return SUPER.setInterval(fcn,interval);
}

// XHR POST
function xhrPost(action, args, form, OKprocs, verbose, preProcs, postProcs, reqTime) {
    let params = action ? 'action=' + encodeURIComponent(action) + ';' : "";
    if (args) { params += args + ';'; }
    params += (getItemValue('do_test') || getItemValue('SYS:do_test')) ? 'SYS:do_test=1;' : "";
    if (form) {
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            params += `${key}=${encodeURIComponent(value)};`;
        }
    }
    const timeLimit = (reqTime && reqTime > 0) ? reqTime : 90000;
    const requestor = xhr('POST', 0, params, OKprocs, preProcs, postProcs, timeLimit);
    const outcome = requestor.execResult();

    if (verbose) {
        let message = outcome.statusText + " - ";
        if (outcome.statusText === 'XML') {
            message += outcome.returnVals + " - ";
        }
        message += outcome.err || outcome.msg;
        SUPER.alert(message);
    }

    if (outcome.statusText === 'EXEC' && requestor.output) {
        return outcome.returnVals;
    }

    return outcome.statusText === 'ERR' || outcome.statusText === 'INIT' ? true : false;
}

function objSetSrc(args) {
	xhrSetSrc(args);
}

// XHR Executable Object Methods
// Prototypes for AgentExec
AgentExec.prototype.getXHRequest    = function() {
    this.msg        = "";
    try {
		this.request    = new XMLHttpRequest();
		this.dom        = "W3C-STD";
	}
	catch(g) {
		this.err            += "XHR Object initialization failed: " + g + " - ";
		this.statusText     = 'ERR';
		this.dom            = "Unknown";
		return false;
	}
	this.msg		= "New XHR Object Loaded.";
    return true;
};

AgentExec.prototype.getItem = function () {
    if (!this.processObj) {return;}
    let result;
    if (this.processObj.itm) {
        return this.processObj.itm;
    } else if (this.processObj.tgt) {
        result = document.getElementById(this.processObj.tgt);
        if (result) {
            return result;
        }
    } else if (this.processObj.tag) {
        result = document.getElementsByTagName(this.processObj.tag);
        if (result.length > 0) {
            return result[this.processObj.idx || 0];
        }
    } else if (this.processObj.cls) {
        result = document.getElementsByClassName(this.processObj.cls);
        if (result.length > 0) {
            return result[this.processObj.idx || 0];
        }
    } else if (this.processObj.qs) {
        result = document.querySelector(this.processObj.qs);
        if (result) {
            return result;
        }
    } else if (this.processObj.qsa) {
        result = document.querySelectorAll(this.processObj.qsa);
        if (result.length > 0) {
            return result[this.processObj.idx || 0];
        }
    }
    return;
};

// Get the XHR executable
AgentExec.prototype.getExec   = function () {
    // Determine the URL of the XHR executable
	const server	= document.location.origin + '/' + document.location.pathname;
	this.exec		= server;
	this.execSrc	= 'base';
    this.msg        += " OK. Executable loaded (" + this.execSrc + "). - ";
    this.statusText = "EXEC";
    return true;
};

// A method to handle callbacks at any stage of XHR request execution
AgentExec.prototype.process       = function (processObjects) {
    const len = processObjects.length;
    for (let i=0; i < len; i++) {
        // check
        if (processObjects[i] && processObjects[i].fcn) {
            // Assign this process object and its function to the executable object
            this.processObj     = processObjects[i];
            this.processFcn     = (this[this.processObj.fcn]) ? this[this.processObj.fcn] :
                document[this.processObj.fcn] ? document[this.processObj.fcn] : this.processObj.fcn;
            // Execute the process, capturing any result value
            let res_val = this.result_val ? this.result_val : '';
            this.returnVals[i]  = this.processFcn(res_val);
        }
    }
};

// A method to stringify the executable object
AgentExec.prototype.toString      = function () {
    return  "Status: " + this.statusText + " " +
        ((this.msg) ? "Msg: " + this.msg + " " : "") +
        ((this.err) ? "Err: " + this.err + " " : "") +
        this.returnVals.join(" - ");
};

// A method to stringify the result array
AgentExec.prototype.resToString       = function () {
    return this.returnVals.join(" - ");
};

// A method to get the result (current state, really) from the executable
AgentExec.prototype.execResult        = function () {
    return {'msg':this.msg, 'err':this.err, 'statusText':this.statusText, 'returnVals':this.returnVals};
};

AgentExec.prototype.xhrAbort      = function () {
    this.statusText     = 'ERR';
    this.request.abort();
    this.err        += this.processObj.val || 'Aborted with ' + this.toString();
    SUPER.status   = this.err;
};

AgentExec.prototype.xhrReportErr  = function () {
    this.statusText     = 'ERR';
    SUPER.status   = this.err + ((this.processObj.val) ? '  ' + this.processObj.val : '');
    this.err        += (this.processObj.val) ? ' - ' + this.processObj.val : '';
};

AgentExec.prototype.xhrReportMsg  = function () {
    SUPER.status   = this.msg + ' ' + ( !!this.processObj.val ? this.processObj.val : this.statusText);
    this.msg       += ' ' + ( !!this.processObj.val ? this.processObj.val : this.statusText) + " - ";
};

AgentExec.prototype.say   = function () {
    SUPER.alert(this.processObj.val);
};

AgentExec.prototype.hey   = function (msg) {
    SUPER.alert( (msg) ? msg : this.statusText );
};

// A method for assembling the executable's url on the fly
// Based on BVA use of `[serverURL]/[xhr_sid|token]?[querystring|]`
AgentExec.prototype.makeExecURL   = function (args) {
    let exURL		= this.exec;
    const sid		= (this.sid) 				? this.sid
    					: (getMeta().token)		? getMeta().token
    					: (getMeta().xhr_sid)	? getMeta().xhr_sid
    					: (SUPER.sid)			? SUPER.sid : "";
    exURL           += (sid) ? '/' + sid : "";
    exURL           += (args) ? '?' + args : "";
    return exURL;
};

AgentExec.prototype.getItemValue    = function () {
	let ret = getV( this.getItem() );
	if (ret.srcStat[0] === 'OK') {
		return ret.vals[0];
	}
    return "";
}

AgentExec.prototype.getItemValues    = function () {
	let ret = getV( this.getItem() );
	if (ret.srcStat[0] === 'OK') {
		return ret.vals;
	}
    return [];
}

AgentExec.prototype.getMetaValue    = function (metaItem) {
	if (!metaItem) { return; }
	return getDeepMetaObj[metaItem] || 'huh?';
}

AgentExec.prototype.clearItem    = function () {
    return setV(this.getItem(), [""]);
};

AgentExec.prototype.fadeClearItem    = function () {
    const thisItem			= this.getItem();
    let upd					= setV(thisItem, [""]);
    thisItem.style.color	= "#666";
    setTimeout(function(){thisItem.style.color  = "#CCC";},1000);
    return upd;
};

AgentExec.prototype.clearElem    = function () {
    return setV(this.getItem(), [""]);
};

AgentExec.prototype.updateItem    = function () {
    let retVal  = (this.processObj.val) ? this.processObj.val : (this.result_val) ? this.result_val : this.request.responseText || '';
    return setV(this.getItem(), [retVal]);
};

AgentExec.prototype.refreshItem    = function () {
    let retVal  = (this.processObj.val) ? this.processObj.val : (this.result_val) ? this.result_val : '';
    return retVal ? setV(this.getItem(), [retVal]) : '';
};

AgentExec.prototype.updateItemWait    = function () {
    let retVal  = (this.processObj.val) ? this.processObj.val : '';
    let spinnerSize = (this.processObj.size) ? this.processObj.size : 18;
    return setV(this.getItem(), [wait_spinner(spinnerSize,retVal)]);
};

AgentExec.prototype.flashUpdateItem    = function () {
    let retVal  = (this.processObj.val) ? this.processObj.val : (this.result_val) ? this.result_val : this.request.responseText || '';
    const thisItem    = this.getItem();
    let upd     =  setV(thisItem, [retVal]);
    if (thisItem) {
        let oldColor            = thisItem.style.color;
        let oldBgColor			= thisItem.style.backgroundColor;
        thisItem.style.color    = "#F00";
        thisItem.style.backgroundColor    = "#FF0";
        setTimeout(function(){thisItem.style.color=oldColor;thisItem.style.backgroundColor=oldBgColor;},1000);
    }
    return upd;
};

AgentExec.prototype.enableItem = enableItem;
AgentExec.prototype.disableItem = disableItem;

AgentExec.prototype.setItemSrc    = function () {
    const obj     = this.getItem();
    if (!obj) {
        this.statusText     = 'ERR';
        this.err        += 'No object!';
        SUPER.status   = this.err;
        return undefined;
    }
    const srcURL  = (this.processObj.url) ? this.processObj.url : (this.objURL) ? this.objURL : this.exec;
    try {
        obj.src = "";
        obj.src = srcURL;
    } catch (e) {
        this.statusText     = 'ERR';
        this.err        += 'Source not set: ' + e;
        SUPER.status   = this.err;
        return undefined;
        }
    return srcURL;
};

AgentExec.prototype.setItemSrcDoc    = function () {
    const obj     = this.getItem();
    if (!obj) {
        this.statusText     = 'ERR';
        this.err        += 'No object!';
        SUPER.status   = this.err;
        return undefined;
    }
    let retVal  = (this.processObj.val) ? this.processObj.val : (this.result_val) ? this.result_val : this.request.responseText || '';
    try {
        obj.srcdoc = retVal;
    } catch (e) {
        this.statusText     = 'ERR';
        this.err        += 'Source not set: ' + e;
        SUPER.status   = this.err;
        return undefined;
        }
    return 1;
};

AgentExec.prototype.clearItemSrc    = function () {
    const obj     = this.getItem();
    if (!obj) {
        this.err        += 'No object!';
        SUPER.status   = this.err;
        return undefined;
    }
    try {
        obj.src = "";
    } catch (e) {
        this.err        += 'Source not cleared: ' + e;
        SUPER.status   = this.err;
        return undefined;
        }
    return 1;
};

AgentExec.prototype.setItemStyle  = function () {
    const item  = this.getItem();
    let prop    = (this.processObj.prop) ? this.processObj.prop : (this.processObj.sel) ? this.processObj.sel : '';
    if (!item) { return undefined; }
    if (!prop) { return undefined; }
    if (prop in item.style) {
        item.style[prop] = (this.processObj.val) ? this.processObj.val : '';
        return this.processObj.val;
    } else  { return undefined; }
};

AgentExec.prototype.direct    = function () {
    return (this.processObj.val) ? this.processObj.val : this.request.responseText;
};

AgentExec.prototype.updateItemXML = function () {
    let thisXML = (this.processObj.val) ? this.processObj.val : this.request.responseXML;
    thisXML     = (thisXML) ? thisXML : "<?xml version=\"1.0\"?><result><value>No XML Data Returned. </value><status>OK</status></result>";
    return setV(this.getItem(), [thisXML]);
};

AgentExec.prototype.updateElem    = function () {
    return setV(this.getItem(), [(this.processObj.val) ? this.processObj.val : (this.result_val) ? this.result_val : this.request.responseText]);
};

AgentExec.prototype.appendToItem  = function () {
    let val  = (this.processObj.val) ? this.processObj.val : (this.result_val) ? this.result_val : this.request.responseText;
    //let val  = (this.processObj.val) ? this.processObj.val : (this.result_val) ? this.result_val : (this.processObj.sig==='directOK') ? this.request.responseText : '';
    let sep  = (this.processObj.sep) ? this.processObj.sep : "<br />";
    return setV(this.getItem(), [val],'+',sep);
};

AgentExec.prototype.appendToElem  = function () {
    let val  = (this.processObj.val) ? this.processObj.val : (this.result_val) ? this.result_val : this.request.responseText;
    let sep  = (this.processObj.sep) ? this.processObj.sep : "<br />";
    return setV(this.getItem(), [val],'+',sep);
};

AgentExec.prototype.addSelect = function() {
    let val  = (this.processObj.val) ? this.processObj.val : (this.result_val) ? this.result_val : this.request.responseText;
    const thisItem   = this.getItem();
    const itemType   = String( thisItem.type || thisItem.tagName ).toUpperCase();
    if (itemType !== 'SELECT-ONE') {return 1;}
    const numOpts = thisItem.options.length;
    for (let i=0;i<numOpts;i++) {
        if (thisItem.options[i].value===val[0]) {
            thisItem.options[i].innerHTML=val[1];
            return 1;
        }
    }
    thisItem.options.length++;
    thisItem.options[numOpts].value=val[0];
    thisItem.options[numOpts].innerHTML=val[1];
    thisItem.selectedIndex = numOpts;
    return 1;
};

// Direct DOM Manipulation
AgentExec.prototype.addDomElem   = function() {
    const elemClass  = (this.processObj.val) ? this.processObj.val : (this.result_val) ? this.result_val : this.request.responseText;
    const newDomElem  = document.createElement(elemClass);
    const newElemType    = (this.processObj.elemType) ? this.processObj.elemType : '';
    if (newElemType && newDomElem.type) {
        newDomElem.type=newElemType;
    }
    if (this.processObj.setId) {
        newDomElem.id = this.processObj.setId;
    }
    if (this.processObj.setName) {
        newDomElem.name = this.processObj.setName;
    }
    const DomParent   = this.getItem();
    DomParent.appendChild(newDomElem);
    return newDomElem;
};

AgentExec.prototype.deleteDomElem   = function() {
    const DomElem     = this.getItem();
    if (!DomElem) { return undefined;}
    const DommParent   = DomElem.parentNode;
    DommParent.removeChild(DomElem);
    return DomElem;
};

AgentExec.prototype.removeDomElem  = function() {
    const DomElem	= this.getItem();
    if (!DomElem) { return }
    let DommParent	= DomElem.parentNode;
    DomParent		??= DomElem.parentNode;
    DommParent.removeChild(DomElem);
    return DomElem;
};

// Page message constructor - Call with "new PageMsg(messageName)"
// TODO: persistent param
function PageMsg(messageName,messageClass){
    // Initial values for the message object
    this.statusText     = "INIT";
    this.statusMsg      = "";
    this.errMsg         = "";
    this.initTime       = new Date().getTime();
    const msgName       = messageName || 'msg_' + this.initTime;
    if ($(msgName+'_div')) {
        removeDomElem(msgName+'_div');
    }
    this.name           = msgName;
    this.msgClass		= messageClass || 'special_msg';
    this.id				= msgName+'_pageMsg';
    this.msgDateTime    = this.initTime;
    this.msgBoxID       = msgName+'_div';
    this.msgFrameID     = msgName+'_frame';
    this.msgTitleID     = msgName+'_title';
    this.msgBodyID      = msgName+'_body';
    this.msgStatusID    = msgName+'_status';
    this.msgHelpID      = msgName+'_help';
    this.msgActsID      = msgName+'_btn_div';
    this.cancelBtnID    = msgName+'_Cancel_btn';
    this.OKBtnID        = msgName+'_OK_btn';
    this.closeBtnID     = msgName+'_Close_btn';
    this.helpBtnID      = msgName+'_Help_btn';
    this.defBtns		= {'help':'?', 'cancel':'Cancel', 'close':'', 'OK':'OK'};
    this.defWidth       = 'auto';  // '299pt';
    this.defHeight      = 'auto';  // '400pt';
    this.defL           = '144pt';
    this.defT           = '96pt';
    this.defR           = '8pt';
    this.defB           = '24pt';

    const that          = this;
    document.body.id    = document.body.id ? document.body.id : 'mainbody';

    docNode('addDomElem',document.body.id,'div',this.msgBoxID);
    this.msgBox = $(this.msgBoxID);
    this.msgBox.className = this.msgClass + '_box';
    this.setMsgLoc();
    this.setMsgSize();

    docNode('addDomElem',this.msgBoxID,'div',this.msgFrameID);
    this.msgFrame = $(this.msgFrameID);
    this.msgFrame.className = this.msgClass + '_frame';

    docNode('addDomElem',this.msgFrameID,'div',this.msgTitleID);
    this.msgTitle = $(this.msgTitleID);
    this.msgTitle.className = this.msgClass + '_title';

    docNode('addDomElem',this.msgFrameID,'div',this.msgBodyID);
    this.msgBody = $(this.msgBodyID);
    this.msgBody.className = this.msgClass + '_body';

    docNode('addDomElem',this.msgFrameID,'div',this.msgActsID);
    this.msgActs = $(this.msgActsID);
    this.msgActs.className = this.msgClass + '_btns';

	if ( this.defBtns.help ) {
		docNode('addDomElem',this.msgActsID,'button',this.helpBtnID);
		setItemValue(this.helpBtnID,this.defBtns.help);
		this.helpBtn = $(this.helpBtnID);
		this.helpBtn.style.position = 'absolute';
		this.helpBtn.style.left = '5pt';
		registerEvent(this.helpBtnID,'click',function(){that.showHelp();},true);
	}

    docNode('addDomElem',this.msgActsID,'span',this.msgStatusID);
    $(this.msgStatusID).style.position = 'absolute';
    $(this.msgStatusID).style.left = '3em';
	setItemValue(this.msgStatusID,this.statusMsg);

	if ( this.defBtns.cancel ) {
		docNode('addDomElem',this.msgActsID,'button',this.cancelBtnID);
		setItemValue(this.cancelBtnID,this.defBtns.cancel);
		registerEvent(this.cancelBtnID,'click',function(){that.Cancel();},true);
	}

	if ( this.defBtns.close ) {
		docNode('addDomElem',this.msgActsID,'button',this.closeBtnID);
		setItemValue(this.closeBtnID,this.defBtns.close);
		registerEvent(this.closeBtnID,'click',function(){that.Close();},true);
	}

	if ( this.defBtns.OK ) {
		docNode('addDomElem',this.msgActsID,'button',this.OKBtnID);
		setItemValue(this.OKBtnID,this.defBtns.OK);
		registerEvent(this.OKBtnID,'click',function(){that.OK();},true);
	}

    docNode('addDomElem',this.msgBoxID,'div',this.msgHelpID);
    this.msgHelp = $(this.msgHelpID);
	const helpMsgText = 'Help is on the way [' + this.id + ']';
    this.msgHelp.innerHTML = helpMsgText;
    this.msgHelp.className = this.msgClass + '_help';
}

PageMsg.prototype.setMsgLoc = function(L,T,R,B) {
    this.setL(L);
    this.setT(T);
    this.setR(R);
    this.setB(B);
};

function changeDimension(dim,delta) {
    delta       	= delta || '0';
    const dimMatch	= /(\d+)(em|pt|px)?/;
    let parsedDim   = dim.match(dimMatch);
    let parsedDelta = delta.match(dimMatch);
    let newDim  	= ((parsedDim[1] * 1)+(parsedDelta[1] * 1)) + parsedDim[2];
    return newDim;
}

PageMsg.prototype.setL = function(L) {
    this.msgBox.style.left = L || null;
};

PageMsg.prototype.setT = function(T) {
    this.msgBox.style.top = T || null;
};

PageMsg.prototype.setR = function(R) {
    this.msgBox.style.right = R || null;
};

PageMsg.prototype.setB = function(B) {
    this.msgBox.style.bottom = B || null;
};

PageMsg.prototype.setMsgSize = function(w,h) {
    this.setWidth(w || '');
    this.setHeight(h || '');
};

PageMsg.prototype.setWidth = function(w) {
    this.msgBox.style.width = w || this.defWidth;
};

PageMsg.prototype.setHeight = function(h) {
    this.msgBox.style.height = h || this.defHeight;
};

PageMsg.prototype.showMessage = function(msg) {
    msg = msg || getItemValue(this.msgBody.id) || '';
    setItemValue(this.msgBody.id,msg);
	setItemValue(this.msgStatusID,'Open');
    this.msgBox.style.display = 'block';
};

PageMsg.prototype.hideMessage = function(status) {
	setItemValue(this.msgStatusID, status || 'Hidden');
	this.msgBox.style.display = 'none';
};

PageMsg.prototype.setMessage = function(msg) {
    msg = msg || '';
    setItemValue(this.msgBody.id,msg);
};

PageMsg.prototype.setStatus = function(status) {
    status = status || '';
    this.statusMsg = status;
	setItemValue(this.msgStatusID,this.statusMsg);
};

PageMsg.prototype.getStatus = function() {
	return getItemValue(this.msgStatusID);
};

PageMsg.prototype.clearMessage = function() {
    setItemValue(this.msgBody.id,'');
};

PageMsg.prototype.setTitle = function(title) {
    title = title || '';
    setItemValue(this.msgTitle.id,title);
};

PageMsg.prototype.Cancel = function() {
	this.Cancelfcn ? this.Cancelfcn()
		: this.defCancelfcn();
};

PageMsg.prototype.defCancelfcn = function() {
	this.hideMessage('Cancelled');
};

PageMsg.prototype.setCancelfcn = function(newCancelfcn) {
	const that = this; // needed?
	this.Cancelfcn = newCancelfcn ? function() {newCancelfcn.call(that) }
		: this.defCancelfcn();
};

// No change to status
PageMsg.prototype.Close = function() {
	this.Closefcn ? this.Closefcn()
		: this.defClosefcn();
};

PageMsg.prototype.defClosefcn = function() {
	this.hideMessage('Closed');
};

PageMsg.prototype.setClosefcn = function(newClosefcn) {
	const that = this; // needed?
	this.Closefcn = newClosefcn ? function() { newClosefcn.call(that) }
		: this.defClosefcn();
};

PageMsg.prototype.OK = function() {
	this.OKfcn ? this.OKfcn()
		: this.defOKfcn();
};

PageMsg.prototype.defOKfcn = function() {
	this.hideMessage('OK');
};

PageMsg.prototype.setOKfcn = function(newOKfcn) {
	const that = this;  // needed?
	this.OKfcn = newOKfcn ? function() {newOKfcn.call(that) }
		: this.defOKfcn;
};

PageMsg.prototype.setHelpMsg = function(helpMsg) {
    setItemValue(this.msgHelpID, ((helpMsg) ? helpMsg : getItemValue(this.msgHelpID) || ''));
}

PageMsg.prototype.showHelp = function(helpMsg) {
    setItemValue(this.msgHelpID, ((helpMsg) ? helpMsg : getItemValue(this.msgHelpID) || ''));
    const parentHt = this.msgBox.style.height;
    this.msgHelp.style.top = parentHt;
    this.msgHelp.style.display = 'block';
    setItemValue(this.helpBtnID,'&bull;');
    const that = this;
    unRegisterEvent(this.helpBtnID,'click',function(){that.showHelp();},true);
    registerEvent(this.helpBtnID,'click',function(){that.hideHelp();},true);
};

PageMsg.prototype.hideHelp = function(){
    this.msgHelp.style.display = 'none';
    setItemValue(this.helpBtnID,this.defBtns.help);
    const that = this;
    unRegisterEvent(this.helpBtnID,'click',function(){that.hideHelp();},true);
    registerEvent(this.helpBtnID,'click',function(){that.showHelp();},true);
};

/*
<button type="button" onclick="doc([{'fcn':'AddPageMsg','msg':'Hey','val':'This is the message. Whaddya think?','ttl':'Important!'}]);">Test</button>
*/

AgentExec.prototype.showPageMsg  = function() {
    const msgName		= this.processObj.msg;
    const curStatus	= getItemValue(msgName+'_status') || '';
	if (!!curStatus && curStatus !== 'Cancelled') {
		$(msgName+'_div').style.display='block';
		SUPER[msgName+'_pageMsg'].setStatus('Open');
	} else {
		this.AddPageMsg();
	}
};

AgentExec.prototype.hidePageMsg  = function() {
    const msgName		= this.processObj.msg;
	SUPER[msgName+'_pageMsg'].hideMessage();
};

AgentExec.prototype.closePageMsg  = function() {
    const msgName		= this.processObj.msg;
	SUPER[msgName+'_pageMsg'].Close();
};

AgentExec.prototype.AddPageMsg  = function() {
    const msgName = this.processObj.msg;
    const msgVal = this.processObj.val;
    const msgTitle = this.processObj.ttl;
    const options = this.processObj.opts || {'use_defaults':true};
    const thisMsg = new PageMsg(msgName,'special_msg_working',0);  // special_msg_working
    SUPER[thisMsg.id] = thisMsg;

    thisMsg.setTitle(msgTitle);
    thisMsg.setMessage(msgVal) || '';
	if (!!options.use_defaults) {
		thisMsg.setL(thisMsg.defL);
		thisMsg.setT(thisMsg.defT);
		thisMsg.setWidth(thisMsg.defWidth);
		thisMsg.setHeight(thisMsg.defHeight);
		thisMsg.showMessage();
		return thisMsg;
	}
    if (!!options.show) {
		thisMsg.showMessage(msgVal);
    } else {
    	thisMsg.msgBox.style.display = 'none';
    }
    if (!!options.L) {
		thisMsg.setL(options.L);
    }
    if (!!options.T) {
		thisMsg.setT(options.T);
    }
    if (!!options.R) {
		thisMsg.setR(options.R);
    }
    if (!!options.B) {
		thisMsg.setB(options.B);
    }
    if (!!options.H) {
		thisMsg.setHeight(options.H);
    }
    if (!!options.W) {
		thisMsg.setWidth(options.W);
    }

//     thisMsg.setClosefcn(function(){
// 		alert(msgVal);
// 		this.defClosefcn();
// 	});
};


AgentExec.prototype.focusItem     = function () {
    const item    = this.getItem();
    if (item !== null) { return item.focus(); }
    return 1;
};

AgentExec.prototype.xhrText       = function () {
    return this.request.responseText || "";
};

AgentExec.prototype.xhrHdr       = function () {
     return 'Status: ' + this.request.status + ' ' + this.request.statusText + '  ' + this.request.getAllResponseHeaders() ;
};

AgentExec.prototype.xhrXML        = function () {
    return this.request.responseXML || "<?xml version=\"1.0\"?><result><value>No XML Data Returned</value><status>OK</status></result>";
};

AgentExec.prototype.xhrObject       = function () {
    let result_obj	= [];
    let result_str = this.request.responseText;
    if (result_str === undefined || result_str.match(/^\s*$/) ) {
        result_obj  = [{"fcn":"xhrReportErr", "val":"No XHR ResponseText received. "}];
        return result_obj;
    }
    const res_type = typeof(result_str) || 'Unknown Result Type';
    const res_len = result_str.length || 0;
    try {
        if (res_type !== 'string' || !res_len) {
            result_obj = [{"fcn":"xhrReportErr", "val":"Invalid XHR Object: " + res_type + "; length " + res_len}];
        } else {
			if (!!JSON) {
				result_obj	= JSON.parse(result_str);
			} else {
				result_obj	= safeEval(result_str);
			}
			if (result_obj === '') {
				result_obj = [{"fcn":"xhrReportErr", "val":"Invalid Object Serialization."}];
				alert(result_str);
			}
        }
    } catch(e) {
    	//alert(result_str);
        result_obj  = [{"fcn":"xhrReportErr", "val":"Functions: " + e}];
		alert(result_str);
    }
    return result_obj;
};

function safeEval(str) {
    let output;
    try {
        if (typeof(str) !== 'string' || !str.length) {
            output = "";
        } else {
            let t = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, '');
            if (/^[\],:{}\s]*$/.test(t)) {
                output = eval('(' + str + ')');
            } else{
                output = "";
            }
        }
    } catch(e) {
        output  = false;
    }
    return output;
}

/*
-------------------------
Above is derived from Douglas Crockford <https://github.com/douglascrockford/JSON-js/blob/master/json2.js>
 if (/^[\],:{}\s]*$/
        .test(result_str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
-------------------------
*/
