import * as terminal from './terminal.js'
import PlayWakeup from './chapters/wakeup.js'


export default async function() {
    if (terminal.debug) {
        newgame()
        return 
    }
    terminal.tprint('Mouths of Madness')
    await terminal.twait(500)
    terminal.tprint('Version: 0.0.5')
    await terminal.twait(500)
    terminal.tprint('Loading...')
    terminal.tprint('Loaded!')
    await terminal.twait(500)
    main_menu()

}

async function main_menu() {
    // Each time, we want a fresh screen
    terminal.psudoclear()
    // If we have a save file present, then we will want to give the option to continue
    let save_exists = terminal.stateslotsused()
    // Set initial options menu, external to function call
    let options = {
        top: 'Select',
        delta: 'New Game',
        enddivider:true
    }
    if (save_exists) {
        options.gamma = "Continue"
        options.sigma = "Export Save"
    }
    let choice = await terminal.tchoices(options)
    // New Game
    if (choice == "delta") {
        if (save_exists) {
            terminal.tprint("Save game data detected. Overwrite and start a new game?")
            let anyway = await terminal.tchoices({
                gamma: "Yes, delete my old save and start a new game",
                delta: "Wait, can I see a summary of it?",
                sigma: "No, keep my old save",
            })
            // If they chose to keep their old save, its time for main menu again
            if (anyway == "sigma") {
                await main_menu()
            }
            // If they want to see a summary, we show them a summary
            // Or, well, we will. Not yet.
            if (anyway == "delta") {
                terminal.tprint("Not Yet. Returning you to the main menu")
                await terminal.typeprint('. . .', 300)
            }
            // The third option is to just continue
        }
        // As this is the only option available if a save file doesn't exist,
        // it run regardless as long as the fuction reaches this point
        await terminal.typeprint('. . . . . . . . .', 300)
        terminal.tprint("Very good")
        await terminal.twait(1000)
        terminal.tprint('Beginning game')
        await terminal.twait(1000)
        terminal.tprint('God help you')
        await terminal.twait(1000)
        terminal.psudoclear()
        newgame()
    }
    if (choice == 'gamma') {
        terminal.typeprint('Loading Save File', 200)
        await terminal.twait(450)
        terminal.typeprint('Verifying...', 200)
        await terminal.twait(350)
        await terminal.typeprint('Preparing screen...', 150)
        chapterselect() 
    }
}

async function newgame() {
    let playerstate = {rep:{jack:5}}
    terminal.savestate(playerstate, 0)
    chapterselect()
}

async function chapterselect() {
    let playerstate = terminal.loadstate(0)
    console.log('player state is ', playerstate)
    PlayWakeup(playerstate)
}

