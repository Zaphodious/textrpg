let terminal = document.getElementById('terminal')
let inputs = document.getElementById('inputs')
console.log(inputs)
console.log(terminal)

// The width of each individual character
const CHARWIDTH = 9

export function scroll_last() {
    terminal.scrollTop = terminal.scrollHeight+100, 10
}

function term_append(elem) {
    // we know that elem is something that can be appended by this point
    terminal.appendChild(elem)
    // Next tick, set style properties to be animated
    setTimeout(() => {
        elem.style.opacity=1
        elem.style.bottom = 0
        elem.style.left = 0
    }, 0);
    // We want what we just appended to be seen right away
    scroll_last()
}

function line_of_symb(symb, length) {
    let s = ''
    for (let i = 0; i<length; i++) {
        s+=symb
    }
    return s
}

export function divider(symb, middle) {
    let symbreal = symb || '-'
    let s = ''
    let w = twidth()
    if (middle) {
        let segment_w = (w/2)-(middle.length/2)
        let seg = line_of_symb(symbreal, segment_w)
        s = `${seg}${middle}${seg}`
    } else {
        s = line_of_symb(symbreal,w)
    }
    let n = tprint(s)
    n.style.clear="both"
    return n
}

/**
 * Prints messagecontents to the terminal screen. If
 * messagecontents is an array, loops over the array and
 * adds the items sequentially
 * @param {*} messagecontents 
 */
export function tprint(messagecontents) {
    // We're putting everything we do inside a div
    let d = document.createElement('div')
    // If this is an array of elements, each one gets added to the div individually
    if (Array.isArray(messagecontents)) {
        for (let el of messagecontents) {
            d.append(el)
        }
    } else {
        d.append(messagecontents)
    }
    // Put that sucker in the terminal
    term_append(d)
    return d
}

/**
 * Renders unescaped html markup to the terminal
 * @param {*} markup 
 */
export function hprint(markup) {
    // We're putting our things inside a div
    let d = document.createElement('div')
    // Shove the raw markup into the element
    d.innerHTML = markup
    // Get it into the terminal
    term_append(d)
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
 * Outputs the terminal's html contents. Useful for saving
 * the session history.
 */
export function tcontents() {
    return terminal.innerHTML
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
 * Formats an object with keys cooresponding to the five option symbols
 * if 'nodivider' is true, no dividier will be shown
 * If nothing is passed in, delta will be 'Next' and a divider will be drawn
 * @param {*} choiceobj 
 */
function format_choices(choiceobj) {
    choiceobj = choiceobj || {delta:'Next'}
        // divider('-','Choose').style.marginTop = '1em'
    for (let n of ['alpha', 'gamma', 'delta', 'sigma', 'omega']) {
        if (n in choiceobj) {
        let m = tprint(symbols[n]+":")
        m.classList.add('choice-indicator')
        let d = tprint(choiceobj[n])
        d.classList.add('choice-text')
        tprint('').style.clear='both'

        }
    }
    if (!choiceobj.nodivider) {
        divider().style.clear="both"
    } else {
        tprint().style.clear="both"
    }
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
        this._def = _defer()
    }
    async take() {
        return await this._def
    }
    async put(thing) {
        this._def.resolve(thing)
        this._def = _defer()
    }
}

/**
 * Event source for button presses
 */
export const buttonpipe = new Pipe()

/**
 * When the page has loaded, do some setup with the buttons
 */
document.addEventListener('DOMContentLoaded', async () => {
    for (let bname of ['alpha', 'gamma', 'delta', 'sigma', 'omega']) {
        console.log(bname)
        let elem = document.getElementById(`button_${bname}`)
        elem.onclick = (ev) => buttonpipe.put(bname)
    }
})

