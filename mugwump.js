import * as terminal from './terminal.js'

export default async function start(save_function, load_function) {
    let rootfolder = './testing/'
    // console.log('start thing')
    if (!save_function) {
        save_function = (s) => localStorage.setItem('savestate', JSON.stringify(s))
    }
    if (!load_function) {
        load_function = () => JSON.parse(localStorage.getItem('savestate'))
    }
    let scriptstate = await mainmenu(rootfolder, save_function, load_function)
    save_function(scriptstate)
    window.scriptstate = scriptstate
    while (scriptstate.nextentry != false) {
        if (save_function) {
            save_function(scriptstate)
        }
        let m = await (await fetch(`${rootfolder}${scriptstate.nextentry}.mug`)).text()
        scriptstate.nextentry = false
        await parser(m, scriptstate)
    }
    terminal.tprint("End of game")
}


async function mainmenu(rootfolder, save_function, load_function) {
    let scriptstate = {nextentry:'main', descriptions: {}}
    let infojson = await (await fetch(`${rootfolder}info.json`)).json()
    console.log(infojson)
    let existant
    if (load_function) {
        existant = await load_function()
    }
    console.log(existant)
    terminal.tprint(`${infojson.name} v${infojson.version}`)
    await terminal.tprint(`By: ${infojson.author}`)

    if (!terminal.debug) {
        let mainchoices = {
            top: "Welcome",
            delta: "New Game"
        }
        if (existant) {
            mainchoices.alpha = "New Game"
            mainchoices.gamma = "Export Save File"
            mainchoices.delta = "Load"
            mainchoices.sigma = "Examine Saved Game"
            mainchoices.omega = "Delete Save File"
        }
        let res = await terminal.tchoices(mainchoices)
        if (res == "delta") {
            scriptstate = existant || scriptstate
        }
        await terminal.typeprint(".....")
        await terminal.tprint("Game Loaded...")
        await terminal.typeprint(".....")
        await terminal.tprint("Beginning game...")
        await terminal.twait(1000)
    }
    terminal.psudoclear()
    return scriptstate
}


async function parser(text, scriptstate) {
    // Create a key-value store where script vars are kept
    // console.log('parsing started')
    // If a newline is followed by a tab, then it is part of the previous line
    let newtext = text.replace(entertab_regex, ' ')
    // console.log(newtext)
    // We want to process each line, which ends in a newline char
    let aslines = newtext.split('\n')
    // If we're in a result or other context, we don't want to do each thing
    let commenttime = false
    let choiceresult = undefined
    let choices = {}
    let choices_ind = {}
    let lastchoice = undefined
    let choiceline = 0
    let lastgoto = 0
    // Preprocess
    let labels = {'thetop': -1}
    for (let i = 0; i<aslines.length; i++) {
        let line = aslines[i]
        let splits = line.split(' ')
        if (line.startsWith('label')) {
            line = line.replace('label ', '')
            labels[line] = i
        }
        if (line.startsWith('choice')) {
            choices_ind[splits[1]] = i
        }
    }
    console.log(labels)
    console.log(choices_ind)
    // Process over each line
    for (let i = 0; i<aslines.length; i++){
        let line = aslines[i]
    // for (let line of aslines) {
        if (line === 'comment') {
            commenttime = true
        } else if (line === '/comment') {
            commenttime = false
        }
        if (commenttime) {
            continue
        }
        if (line.match(resultline_regex)) {
            let ind = line.match(choiceind_regex)[0]
            if (ind === choiceresult) {
                // line = line.split(ind+": ")[1]
                line = line.substring(ind.length + 3)
            }
        }
        if (line.startsWith('if')) {
            let [conditional, maybeline] = line.replace('if ', '').split(': ')
            let [thevar, switcher, cond] = conditional.split(' ')
            let passes = false
            let thingy = scriptstate[thevar]
            // console.log('>>cond', thevar, switcher, cond)
            switch (switcher) {
                case 'is':
                    cond = literalsolver(cond)
                    passes = thingy === cond
                    break
                case "isn't":
                    cond = literalsolver(cond)
                    passes = thingy != cond
                    break
                case 'exceeds':
                    cond = literalsolver(cond)
                    passes = thingy > cond
                    break
                case 'under':
                    cond = literalsolver(cond)
                    passes = thingy < cond
                    break
                case 'contains':
                    let testline = conditional.split('contains ')[1]
                    let [keyword, amount] = testline.split(' ')
                    let t = testline.split(amount)[1].substring(1)
                    switch (keyword) {
                        case 'any':
                            t = testline.substring(4)
                            passes = t in thingy && thingy[t] > 0
                            break
                        case 'exactly':
                            amount = literalsolver(amount)
                            passes = thingy[t] === amount
                            break
                        case 'over':
                            amount = literalsolver(amount)
                            passes = thingy[t] > amount
                            break
                        case 'under':
                            amount = literalsolver(amount)
                            passes = thingy[t] < amount
                            break


                    }
                    // console.log('testline', testline)
                    break
            }
            if (passes) {
                line = maybeline
            }
        }
        if (line.startsWith('again')) {
            // console.log('i was ', i)
            let [ag, opt] = line.split(' ')
            if (opt) {
                lastchoice = opt
            }
            i = choices_ind[lastchoice]-1
            // console.log('i is now', i)
            continue
        } else if (line.startsWith('change')){
            let [ag, ind] = line.split(' ')
            let newtext = line.split('to ')[1]
            ind = ind.match(choiceind_regex)[0]
            choices[lastchoice][ind] = newtext
        } else if (line.startsWith('delete')) {
            let [ag, ind] = line.split(' ')
            ind = ind.match(choiceind_regex)[0]
            delete choices[lastchoice][ind]
        }
        if (line.startsWith('goto')) {
            let splits = line.split(' ')
            let label = splits[1]
            console.log('goto label is', JSON.stringify(label), 'mapping to ', labels[label])
            if (labels[label]) {
                console.log('makes it here')
                lastgoto = i
                i = labels[label]
                choiceresult = undefined
                choiceline = 0
                continue
            }
        }
        if (line.startsWith('back')) {
            i = lastgoto+1
        }
        if (line.startsWith('choice ')) {
            // First, let's get the label for this choice line
            let splits = line.split(' ')
            lastchoice = splits[1]
            // If the choices have been processed already,
            // use them. Otherwise, process them anew
            let thesechoices = choices[lastchoice]
            if (!thesechoices) {
                let rawchoices = [...line.matchAll(getchoice_regex)]
                thesechoices = {}
                for (let [str, begin] of rawchoices) {
                    let text = str.substring(8)
                    let optionkey = begin.match(choiceind_regex)[0]
                    // console.log(optionkey, text)
                    thesechoices[optionkey] = text
                    // console.log(choices)
                }
                // console.log(choices)
                let text = line.match(choicetxt_regex)[0]
                if (!text.match(choiceind_regex)) {
                    thesechoices['top'] = text
                }
                choices[lastchoice] = thesechoices
            }
            choiceresult = await terminal.tchoices(thesechoices)
        }
        await normal_line(line, scriptstate)
    }
}

async function normal_line(line, scriptstate) {
    if (line == '') { return }
        // console.log(line)
        let splits = line.split(' ')
        // The first word of each line determines what that line does
        let first_word = splits[0]
        let rest = line.split(first_word+' ')[1]
        let loud = false
        switch (first_word) {
            case 'clear':
                terminal.psudoclear()
                break
            case 'continue' :
                await terminal.tchoicenext(rest)
                break
            case '>roll':
                loud = true
            case 'roll':
                let [d_amt, d_sides] = splits[1].split('d')
                console.log('rolling a ', d_sides, 'dice ', d_amt, 'times')
                let rolls = []
                for (let i = 0; i<d_amt; i++) {
                    rolls.push(Math.ceil(Math.random()*100 % d_sides))
                }
                let rolltotal = rolls.reduce((x,y)=>x+y)
                scriptstate['$lastroll'] = rolltotal
                if (loud) {
                    terminal.tprint(`Rolling ${splits[1]}, results are: ${rolls}, totaling ${rolltotal}`)
                }
                break
            case 'describe':
                let [_, invname] = splits
                console.log(invname)
                let inv = scriptstate[invname]
                for (let [k,v] of Object.entries(inv)) {
                    console.log(k, v)
                    terminal.tblank()
                    terminal.tprint(`${v}x ${k}`)
                    let desc = scriptstate.descriptions[k]
                    if (desc) {
                        terminal.tprint(desc, 'item-description')
                    }
                    await terminal.twait(100)
                }
                break
            case 'description':
                line = line.substring('description'.length+1)
                let [thevarname, thetext] = line.replace(': ', "```").split('```')
                thetext = templatereplace(thetext, scriptstate)
                console.log(thetext)
                scriptstate.descriptions[thevarname] = thetext
                break
            case 'debug':
                debugger
                break
            // Operations on numbers, and on the numbers in inventories
            case 'with':
                let valueline = line.replace(splits[1], '!**').split('!**')[1]
                let newvalue = templatereplace(valueline, scriptstate)
                line = line.replace(valueline, newvalue)
                splits = line.split(' ')
                let [op, varname, operator, value, isrest] = splits 
                // console.log('right now we got', varname, operator, value, isrest)
                let t = scriptstate[varname]
                value = literalsolver(value, scriptstate)
                console.log(op, varname, operator, value, isrest)
                // console.log('right before magic moment', JSON.stringify(isrest))
                if (isrest === undefined || isrest === "") {
                    switch(operator) {
                        case "add":
                            scriptstate[varname]+=value
                            break
                        case 'remove':
                            scriptstate[varname]-=value
                            break
                    }
                } else {
                    let item = line.split(` ${value} `)[1]
                    console.log(item)
                    if (item.startsWith('$')) {
                        item = scriptstate[item]
                    }
                    let inv = scriptstate[varname]
                    let currentvalue = 0
                    if (inv[item]) {currentvalue = inv[item]}
                    switch(operator) {
                        case "add":
                            inv[item] = currentvalue + value
                            break
                        case "remove":
                            inv[item] = currentvalue - value
                            break
                    }
                    // console.log('fooo', scriptstate[varname], item, value)
                }
                
                break
            case 'next':
                rest = templatereplace(rest, scriptstate).substring(3)
                scriptstate.nextentry = rest
                break
            // If the line is 'remember', it is a var
            case 'remember':
                remember(line, scriptstate)
                break
            // A gt indicates standard output
            case '>':
                rest = templatereplace(rest, scriptstate)
                await terminal.tprint(rest)
                break
            // double quote indicates that the line should be presented as something someone says
            case '"':
                // The name is whatever is between the double quote and the first colin
                rest = templatereplace(rest, scriptstate)
                let name = rest.split(': ')[0]
                // console.log(name)
                await terminal.dprint(name, rest)
                break
            case 'wait':
                await terminal.twait(rest || 500)
                break
            // The hash is aside text, for descriptions or other distinct text
            case '#':
                rest = templatereplace(rest, scriptstate)
                await terminal.tprint(rest, 'exposition')
                break
            // the single stop is a newline
            case '.':
                rest = templatereplace(rest, scriptstate)
                await terminal.tblank()
                break
            case '!':
                rest = templatereplace(rest, scriptstate)
                await terminal.typeprint(rest)
                break
            case 'result':


        }

}

function out(line, scriptstate) {

}

function remember(line, scriptstate) {
    let varname = line.split(' ')[1]
    let value = line.split('as ')[1]
    scriptstate[varname] = literalsolver(value, scriptstate)
    // console.log(scriptstate)
}

function literalsolver(value, scriptstate) {
    let realvalue = undefined
    let splitline = value.split(' ')
    if (varname_only_regex.test(value)) {
        value = scriptstate[value]
        console.log(value)
    }
    if (value == 'yes') {realvalue = true}
    else if (value == 'no') {realvalue = false}
    else if (!isNaN(Math.ceil(value)))(realvalue = Math.ceil(value))
    else if (splitline[0]=='all' && splitline[1]=='of') {
        let newinventory = {}
        let rawitems = value.split(',')
        rawitems[0] = rawitems[0].substring(6)
        // console.log('invstring is ', rawitems)
        for (let item of rawitems) {
            let quantity = item.split(' ')[1]
            let actualitem = item.split(quantity)[1].substring(1)
            // console.log(actualitem)
            if (quantity === 'a' || quantity === "A") {
                quantity = 1
            } else if (quantity === 'no') {
                quantity = 0
            } else {
                quantity = Math.ceil(quantity)
            }
            newinventory[actualitem] = quantity
        }
        realvalue = newinventory
    }
    else {
        if (scriptstate) {
            value = templatereplace(value, scriptstate)
        }
        realvalue = value
    }
    return realvalue

}

function templatereplace(line, scriptstate) {
    if (!line){return line}
    // First, get inventory accesses
    let accesses = [...line.matchAll(invaccess_regex_alt)]
    if (accesses[0]) {
        for (let [fullline, thing, _, invname] of accesses) {
            console.log('trying to get', thing, 'from ', scriptstate[invname])
            let subval = scriptstate[invname][thing]
            console.log('subval is', subval)
            if (subval != undefined) {
                line = line.replace(fullline, subval)
            }
        }
    }
    console.log(accesses)
    // After we've done inv access, we can do a direct replace
    for (let k of Object.keys(scriptstate)) {
        if (line.includes(k)) {
            let v = scriptstate[k]
            switch(v) {
                case true:
                    v = 'yes'
                    break
                case false:
                    v = 'no'
                    break
            }
            line = line.replace(k, v)
        }
    }
    return line
}

let entertab_regex= /\n(    |\t)/g

let choiceind_regex = /(?<=:)(alpha|delta|gamma|sigma|omega)(?=:)/g

let getchoice_regex = /(:(alpha|delta|gamma|sigma|omega): ).+?(?= :(alpha|delta|gamma|sigma|omega):|\n|$)/g

let choicetxt_regex = /(?<=choice \w+ ).+?(?= :(alpha|delta|gamma|sigma|omega):)/g

let resultline_regex = /^:(alpha|delta|gamma|sigma|omega):/g

let varname_regex = /\$\w+?(?= |\t|$|\n)/

let varname_only_regex = /^\$\w+?(?=$)/

let invaccess_regex = /\$\w+\(.*\)/g

let invaccess_regex_alt = /@(.+?) (in+?) (\$\w+)/g