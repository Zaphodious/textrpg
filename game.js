import * as terminal from './terminal.js'
import * as gameutil from './game_util.js'
import PlayWakeup from './chapters/wakeup.js'
import PlayFirstFight from './chapters/firstfight.js'
import * as firstfight from './chapters/firstfight.js'


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
    await gameutil.descriptions_loaded
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
    if (choice == 'sigma') {
        terminal.tprint("Unfortunately, this feature does not yet exist")
        await terminal.tchoicenext()
        main_menu()
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
    let playerstate = {playing:true,rep:{jack:5},flags:{jack:{},stages:{wakeup:false}}}
    terminal.savestate(playerstate, 0)
    chapterselect()
}

async function chapterselect() {
    // If we're at this point, we need the
    // save state in slot 0
    let playerstate = terminal.loadstate(0)
    console.log('player state is ', playerstate)
    // If we're debugging, then the
    // author is writing and needs whatever
    // is in this if block to run
    if (terminal.debug) {
        playerstate.next = "firstfight.walking_to_sals"
        playerstate.rep.jack = 12
        playerstate.flags.going_to_sals = true
        playerstate.getting_picked_up = false
        playerstate.bag = {
            "Cellphone":1,
            "Mysterious Black Box":1,
            "Meal Bar": 3,
            "Broken Laptop": 1,
            "Money": 126
        }
        await engine(playerstate)
        return
    }
    // Usually, we'd just play wakeup module and then start the engine.
    // Wakeup starts the adventure and sets the tone for the rest of the
    // game. It is apart from the engine, as it is special amongst entries.
    await PlayWakeup(playerstate)
    await engine(playerstate)
    terminal.tprint("Done with wakeup")
}

let entries = {firstfight}
console.log(entries)

async function engine(playerstate) {
    // Loops continuously until the game indicates that it is done
    while (playerstate.playing) {
        // Adds enough of a delay between iterations
        // that a lack of pause within an entry
        // will cause the window to freeze up
        await terminal.twait(500)
        // The previous entry will have set 'next' to the ID of the enxt entry.
        // Here, we determine it
        let nextname = playerstate.next.split('.')
        // The first part of the entry name is the name of the module it comes from
        let module = entries[nextname[0]]
        if (module) {
            // The second bit is the function name
            let func = module[nextname[1]]
            if (func) {
                try {
                    // We invoke the function, waiting for it to be done
                    await func(playerstate)
                    // Continue after
                    await terminal.tchoicenext()
                    terminal.psudoclear()
                    // Then we shift all previous saves up, filling a total of 5 slots
                    // Later, will we make the engine recognize when it's already
                    // recovered from an error, and walk the save back through all five slots
                    terminal.saveslotshiftup()
                    // Now we save teh player's state in slot 0
                    terminal.savestate(playerstate, 0)
                } catch(e) {
                    // If there's been an error, we set the appropriate flags
                    // on the playerstate object (including the one that stops the loop)
                    // and give it reference to the error
                    playerstate.playing = false
                    playerstate.errorout = true
                    playerstate.errorob = e
                }
            } else {
                // if the function isn't available, set flags and 
                // create an error for it
                let m = `Entry "${nextname[1]}" not available in "${nextname[0]}"`
                await terminal.tprint(m)
                playerstate.playing = false
                playerstate.errorout = true
                playerstate.errorob = new Error(m)
            }
        } else {
            // If the module isn't available, set the flags for it
            terminal.tprint(`Module "${nextname[0]}" not available `)
            playerstate.played = false
            playerstate.errorout = true
        }
    }
    // 
    if (playerstate.errorout) {
        terminal.tblank()
        terminal.tprint("Unfortunately, we have encountered an error. You are being returned to the main menu.")
        // console.error(JSON.stringify({ message: playerstate.errorob.message, stack: playerstate.errorob.stack }))
        // As there was an error, we revert the save state to one several entries previous
        terminal.saveslotcopy(2,0)
        console.error(playerstate.errorob)
        await terminal.tchoicenext("Dang it. Alright. ")
    }
    // Even if there was no error, if the game ended we want to go right into the
    // main menu
    main_menu()
}
