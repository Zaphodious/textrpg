import * as terminal from './terminal.js'

export async function print_inventory(playerstate) {
    for (let [k,v] of Object.entries(playerstate.bag)) {
        terminal.tblank()
        terminal.tprint(`${v}x ${k}`)
        terminal.tprint(item_descriptions[k], 'item-description')
        await terminal.twait(100)
    }
    await terminal.tchoicenext()
}

export async function in_game_menu(playerstate) {
    let menu_exited = false
    let mainchoices = {
        top: "Menu",
        gamma: "Inventory",
        sigma: "Main Menu",
        omega: "Exit Menu",
        enddivider: true
    }
    if (playerstate.errorout) {
        delete mainchoices.omega
    }
    while (!menu_exited) {
        let firstchoice = await terminal.tchoices(mainchoices)
        switch(firstchoice) {
            case 'gamma':
                await print_inventory(playerstate)
                break
            case 'omega':
                await terminal.tprint("Exiting Menu")
                menu_exited = true
                break
            case 'sigma':
                
        }
    }
}

let item_descriptions = {}

export let descriptions_loaded = new Promise((res,rej)=>{
    document.addEventListener('DOMContentLoaded', async () => {
        let f = await fetch('./item_descriptions.json')
        item_descriptions = await f.json()
        console.log(item_descriptions)
        res(item_descriptions)
    })
})
