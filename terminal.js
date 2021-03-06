// Horray for caching!
let terminal = document.getElementById('terminal')
let inputs = document.getElementById('inputs')

// The width of each individual character
const CHARWIDTH = 9
const CHARHEIGHT = 20

/**
 * Scrolls the terminal to the end of it. Used internally every
 * time there's a print
 */
export function scroll_last() {
    terminal.scrollTop = terminal.scrollHeight+100, 10
}


/**
 * Takes a div, and appends it to the end of the terminal. Then sets
 * certain CSS properties so that it shows a nice transition
 * @param {div} elem 
 */
async function term_append(elem, animate) {
    animate = animate || true
    // we know that elem is something that can be appended by this point
    terminal.appendChild(elem)
    // Next tick, set style properties to be animated
    if (animate) {
        setTimeout(() => {
            elem.style.opacity = 1
            elem.style.bottom = 0
            elem.style.left = 0
        }, 0);
    } else {
        elem.style.opacity = 1
        elem.style.bottom = 0
        elem.style.left = 0
    }
    // We want what we just appended to be seen right away
    scroll_last()
    await twait(500)
}

/**
 * Given the symbol to write and the length desired,
 * just makes a string of that length with that symbol
 * @param {*} symb 
 * @param {*} length 
 */
function line_of_symb(symb, length) {
    let s = ''
    for (let i = 0; i<length; i++) {
        s+=symb
    }
    return s
}

/**
 * Makes a line of symbols (by default, '-'), and adds it to the
 * terminal. If a string is given for 'middle', will print it
 * in the middle of the line intelligently
 * @param {*} symb 
 * @param {*} middle 
 */
export function tdivider(symb, middle, ...classes) {
    // I wish Javascript had default params
    let symbreal = symb || '-'
    // Set the string to build
    let s = ''
    // Cache the width of the terminal
    let w = twidth()
    // If there's something for 'middle', print it in the middle
    if (middle) {
        // The line will be two symbols of equal length...
        let segment_w = (w/2)-(middle.length/2)
        let seg = line_of_symb(symbreal, segment_w)
        // ... and the thing in the middle
        s = `${seg}${middle}${seg}`
        // If we get an off-by-one, easiest way to make sure that
        // the line doesn't wrap is to remove one of the characters. 
        // Here, we opt to remove the first one.
        if (s.length > w) {
            s = s.slice(1, s.length)
        }
    } else {
        // Super simple, just use line_of_symb to make a line of symbols
        s = line_of_symb(symbreal,w)
    }
    // print the line to the terminal
    let n = tprint(s, ...classes)
    // Just in case something is floated above or below
    tfloatclear()
    // Return the result of tprint, just in case
    return n
}

/**
 * Inserts a blank line into the terminal
 */
export async function tblank(...classes) {
    // Each line is a div, and this is no different
    let d = document.createElement('div')
    // The style is simportant
    d.style.display = 'block'
    d.style.height = CHARHEIGHT
    // In order that the line actual function as a blank line, we need to have
    // at least one character of content. So, we add an html blank character.
    d.innerHTML = "&nbsp;"
    // Add it to the terminal
    for (let c of classes) {
        d.classList.add(c)
    }
    await term_append(d)
    return d
}

let emexp = /((\*\*|__|_\*).+?(\*\*|__|\*_))/g
function do_em(messagestring) {
    if (typeof messagestring === 'string') {
        let a = messagestring.split(emexp)
            console.log("a is : ", a)
        a = a.map(s=>{
            let elem = undefined
            let news = undefined
            if (s == '__' || s == '**' || s == '*_' || s == '_*') {
                return ''
            }
            if (s.startsWith('**') && s.endsWith('**')) {
                elem = document.createElement('strong')
                news = s.replace(/\*\*|\*\*/g, '')
                elem.append(news)
            } else if (s.startsWith('__') && s.endsWith('__')) {
                elem = document.createElement('em')
                news = s.replace(/__|__/g, '')
                elem.append(news)
            } else if (s.startsWith('_*') && s.endsWith('*_')) {
                elem = document.createElement('strong')
                let oelem = document.createElement('em')
                news = s.replace(/_\*|\*_/g, '')
                oelem.append(news) 
                elem.append(oelem)
            }
            console.log(elem)
            return elem || s
        })
        return a
    } else {
        return messagestring
    }

}

/**
 * Prints messagecontents to the terminal screen. If
 * messagecontents is an array, loops over the array and
 * adds the items sequentially
 * @param {*} messagecontents 
 */
export async function tprint(messagecontents, ...classes) {
    // We're putting everything we do inside a div
    let d = document.createElement('div')
    // The pre-processor will let us handle speical formatting
    messagecontents = do_em(messagecontents)
    // If this is an array of elements, each one gets added to the div individually
    if (Array.isArray(messagecontents)) {
        for (let el of messagecontents) {
            // Append them one by one
            console.log("el is: ", el)
            if (typeof el === "string") {
                d.append(el)
            } else {
                console.log("this element is ", el)
                d.appendChild(el)
            }
        }
    } else {
        // We use .append in particular, because it handles text. Other methods are
        // DOM-node spcific
        d.append(messagecontents)
        // d.innerHTML += do_em(messagecontents)
    }
    console.log(messagecontents, classes)
    for (let c of classes) {
        if (c) {
            d.classList.add(c)
        }
    }
    // Put that sucker in the terminal
    await term_append(d)
    return d
}

/**
 * Prints a line of dialog to the terminal screen. Aside
 * from 'name', identical to tprint()
 * @param {*} name 
 * @param {*} messagecontents 
 */
export async function dprint(name, messagecontents, ...classes) {
    console.log()
    let s = document.createElement('span')
    s.innerHTML = `&lt${name}&gt`
    s.classList.add("dialog_tag")
    
    if (Array.isArray(messagecontents)) {
        messagecontents = [s, " ", ...messagecontents]        
    } else {
        messagecontents = [s, " ", ...do_em(messagecontents)]
        console.log(messagecontents)
    }
    classes.push('dialog')
    classes.push(`name-${name}`)
    return await tprint(messagecontents, ...classes)
}

/**
 * Renders unescaped html markup to the terminal
 * @param {*} markup 
 */
export async function hprint(pre, markup) {
    // We're putting our things inside a div
    let d = document.createElement('div')
    if (!markup) {
        markup = pre
    } else {
        markup =`<span class="dialog_tag">&lt${pre}&gt</span>${markup}`
        d.classList.add('dialog')
        d.classList.add(`name-${pre}`)
    }
    // Shove the raw markup into the element
    d.innerHTML = markup
    // Get it into the terminal
    await term_append(d)
    return d
}


/**
 * Computes the width of the terminal screen, in characters
 */
export function twidth() {
    // Given that we know the charwidth and the size of our margins, we can
    // predict how many characters will fit inside the terminal view
    let total_margin = 10
    return Math.floor((terminal.clientWidth-total_margin) / CHARWIDTH)
}

/**
 * Same as twidth, but gives the height in characters
 */
export function theight() {
    let total_margin=10
    return Math.floor((terminal.clientHeight-total_margin) / CHARHEIGHT)
}

/**
 * Prints multiple newlines to the terminal, resulting in a "clear"
 * screen that preserves the terminal's history
 */
export async function psudoclear() {
    let s = ''
    // add \n for theight + 10 (arbitrary number, because
    // theight on its own didn't work all the way)
    for (let i = 0; i<theight()*1.5; i++) {
        s+='\n'
    }
    // print the pre, and return the result
    let pre = await hprint(`<pre>${s}</pre>`)
    pre.classList.add('psudoclear')
    return pre
}

/**
 * Types the message text out, one letter at a time. Delay determins the time that passes
 * between letters. If something is passed in as 'pre', it will be printed to the line before
 * the rest of the text is typed out
 * @param {*} message 
 * @param {*} delay 
 * @param {*} pre 
 */
export async function typeprint(message, delay, pre, ...classes) {
    // gotta love a lack of default params
    pre = pre || ""
    delay = delay || 100
    // as always, we start with a div
    let d = document.createElement('div')
    // Even if Pre doesn't exist, popping it into the beginning isn't detrimental
    d.innerHTML = pre

    for (let c of classes) {
        d.classList.add(c)
    }
    // If pre doesn't exist, we begin with the first character of the message string so that the
    // line doesn't collapse
    if (!pre) {
        d.append(message[0])
    }
    // Add the div to the terminal
    term_append(d)
    // If pre, we didn't add the first character to the div, so we do so now
    if (pre) {
        await twait(delay)
        d.append(message[0])
        scroll_last()
    }
    // Now, regardless of if 'pre' exists, we can iterate over the remaining characters
    // of the string
    for (let char of message.slice(1,message.length)) {
        // Wait for the delay, to give the actual typewriter effect
        await twait(delay)
        // Pop on the character
        d.append(char)
        // Scroll to the bottom, otherwise typed text might wrap and not be visible
        scroll_last()
    }
    // So that we don't end right away when the typing animation is done
    await twait(delay)
    return d
}

export async function dtypeprint(message, delay, pre, ...classes) {
    classes.push('dialog')
    classes.push(`name-${pre}`)
    return await typeprint(message, delay, `<span class="dialog_tag">&lt${pre}&gt</span>`, ...classes)
}

/**
 * Outputs the terminal's html contents. Useful for saving
 * the session history.
 */
export function tcontents() {
    // Yeah, it's just the element's innerHTML.
    return terminal.innerHTML
}

export function set_tcontents(newtcontents) {
    terminal.innerHTML = newtcontents
    return newtcontents
}

/**
 * Symbols used for for the terminal's buttons, and other things
 */
export let symbols = {
    alpha:"Α",
    gamma:"Γ",
    delta:"Δ",
    sigma:"Σ",
    omega:"Ω",
}


/**
 * Creates a promise that can be resolved externally
 */
function _defer() {
    let resolve, reject
    let p = new Promise((res, rej)=>{
        resolve = res
        reject = rej
    })
    p.resolve = resolve
    p.reject = reject
    return p

}

/**
 * Creates a single sync point where an event can be broadcast to multiple listeners,
 * without coordinating callbacks, via promises and async/await
 */
class Pipe {
    constructor() {
        // The initial defer is set, so that the pipe is usable
        // out of the box
        this._def = _defer()
    }
    async take() {
        // Meant to be awaited by consumer code. Once something
        // is put, the preomise will resolve. The promise is
        // not replaced until something is put.
        return await this._def
    }
    async put(thing) {
        // First, resolve the original promise
        this._def.resolve(thing)
        // Then, add in a new promise
        this._def = _defer()
        // We don't do the core.async or go thing where
        // producers sync up with consumers, because frankly
        // it's not needed for this lib. Maybe
        // if used in a more demanding environment, something
        // can be hacked together, but I'm not concerned right now
    }
}

/**
 * Event source for button presses. Useful, because
 * we don't want to be let know about every single button press,
 * just presses when we're expecting a result. Awaiting a 'take'
 * is a signal (that we can just let js track for us) that we 
 * care about the result
 */
export const buttonpipe = new Pipe()

/**
 * When the page has loaded, do some setup with the buttons
 */
document.addEventListener('DOMContentLoaded', async () => {
    // We know the names of the five buttons, and what text they'll
    // send back
    for (let bname of ['alpha', 'gamma', 'delta', 'sigma', 'omega']) {
        // Get the button
        let elem = document.getElementById(`button_${bname}`)
        // Set a single click handler that will simply 
        // put the bname value onto the pipe
        elem.onclick = (ev) => buttonpipe.put(bname)
    }
})

/**
 * Adds an invisible line to the terminal, with style.clear set to
 * 'both'. This ensures that anything above and below won't get cozy if
 * things are floated
 */
export function tfloatclear(){
    // We're using a div, like always
    let line = document.createElement('div')
    // Set clear to both, so that floating things below don't
    // snuggle up with things above
    line.style.clear='both'
    // Append it like in tprint()
    terminal.append(line)
    // In case the caller wants to do something funky with the line
    return line
}

/**
 * Formats an object with keys cooresponding to the five option symbols
 * if 'nodivider' is true, no dividier will be shown
 * If nothing is passed in, delta will be 'Next' and a divider will be drawn
 * @param {*} choiceobj 
 */
export async function tchoices(choiceobj) {
    // Default behavior is that delta (middle) is the next prompt
    choiceobj = choiceobj || {delta:'Next', nohandlechoice:true}
    // If the caller has given us a header in 'top', print it
    let begin_class = 'choice_begin'
    let top = choiceobj['top']
    if (top) {
        await twait(500)
        tdivider('-',top, begin_class)
        await twait(500)
        begin_class = ''
    }

    tprint(' ', 'choice-begin')        
    // We go through the greek symbols in order, and if there's
    // an option for them we print them with the symbol. The
    // style set in index.css makes it so that there's always going to
    // be a margin as though the text were manually wrapped,
    // but in a way that is friendly to switching screen size (like
    // what you'd have on a phone or a changing browser window)
    for (let n of ['alpha', 'gamma', 'delta', 'sigma', 'omega']) {
        let t = choiceobj[n]
        if (t && t != '//deleted//') {
            // Give it a nice animation
            await twait(100)
            // First line floats right, to give a good margin
            tprint(` ${symbols[n]} `, 'choice-indicator', n, begin_class)
            // Second line also floats right, fulfilling the margin 
            tprint(choiceobj[n], 'choice-text', begin_class)
            // If we've given the beginning class to a line, give only empty
            // lines going forward
            if (begin_class) {
                begin_class = ""
            }
            // Clear so that the next option doesn't snuggle up with the first
            tfloatclear()
        }
    }
    // We cache the button promise so that we can reference it multiple
    // times later, if needed.
    let buttonpressprom = buttonpipe.take()
    // If nohandlechoice is set to truthy, we don't print the choice
    // to the terminal... but we still return it later
    if (!choiceobj.nohandlechoice) {
        // We add a line to the terminal, that we will then add to later
        let yourchoiceline = await tprint('Your Choice> ')
        // Not every press will be needed. If we get a press that isn't,
        // we should ignore it and try again.
        let needsresolving = true
        while (needsresolving) {
            // Get the result of the user pressing a button
            let button_pressed = await buttonpressprom
            // We only care about the button pressed if its one of the options
            if (button_pressed in choiceobj) {
                // For proper spacing and all that, we append the choice text to 
                // the choice line. At time of writing, this makes the chosen
                // text appear suddenly rather then animated in. 
                let ind = document.createElement('span')
                ind.classList.add(button_pressed)
                ind.classList.add('chosen-symbol')
                ind.append(`${symbols[button_pressed]}`)
                yourchoiceline.append(ind)
                yourchoiceline.append(choiceobj[button_pressed])
                // Tell the loop that its job is done
                needsresolving = false
            } else {
                // Try again by getting the new promise
                buttonpressprom = buttonpipe.take()
            }

        }
    }
    // If nodivider isn't set, we print a divider
    if (choiceobj.enddivider) {
        // animation, basically
        await twait(500)
        tdivider()
    }
    // Regardless, we want to make sure that floats are cleared just in case
    tfloatclear()
    // Promise resolves when a user selects an option
    return await buttonpressprom
}

export function tchoicenext(message) {
    message = message || "Continue..."
    return tchoices({delta:message, nohandlechoice:true})
}

/**
 * Function that turns a timeout into a promise, to make "waiting"
 * easier in async functions (like the game function)
 * @param {*} millis 
 */
export function twait(millis) {
    return new Promise(a=>setTimeout(a, millis))
}


// See if devtools are on
export let debug = new URLSearchParams(location.search).get('debug') != undefined
console.log(debug)
if (debug) {
    tprint('debug mode detected')
    psudoclear()
}
 
/**
 * Saves the state, in a numbered slot, along with terminal contents. Returns the slot number
 * @param {Object} state 
 * @param {Number} slot 
 */
export function savestate(state, slot) {
    if (slot == undefined) {
        slot = localStorage.length
    }
    console.log(slot)
    let full_state={state, tout:tcontents()}
    localStorage.setItem(slot, JSON.stringify(full_state))
    return slot
}

/**
 * Recovers state and terminal contents from storage. If restore_terminal_state is true, makes
 * the terminal state what it was at the time of the former save
 * @param {Number} slot 
 * @param {boolean} restore_terminal_state 
 */
export function loadstate(slot, restore_terminal_state) {
    restore_terminal_state = restore_terminal_state || false
    if (slot in localStorage) {
        let {state, tout} = JSON.parse(localStorage.getItem(slot))
        if (restore_terminal_state) {
            set_tcontents(tout)
        }
        return state
    }
    return false
}

/**
 * Copies save data from one slot into another slot, potentially
 * overwriting its contents.
 * @param {Number} slot_from 
 * @param {Number} slot_to 
 */
export function saveslotcopy(slot_from, slot_to) {
    let thing = localStorage.getItem(slot_from)
    localStorage.setItem(slot_to, thing)
}

export function saveslotshiftup(shiftamount) {
    for (let i = 0; i<shiftamount; i++) {
        saveslotcopy(i, i+1)
    }
}

export function stateslotsused() {
    return localStorage.length
}
