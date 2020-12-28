import * as terminal from './terminal.js'
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
    terminal.psudoclear()
    let choice = terminal.tchoices({
        top: 'Select',
        delta: 'New Game',
        enddivider:true
    })
    await choice
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

async function newgame() {
    let playerstate = {rep:{jack:5}}
    await terminal.twait(3000)
    await terminal.typeprint(' hey', 600, '?>')
    terminal.tblank()
    await terminal.tchoicenext('...')
    await terminal.typeprint(' How are you feeling?', 100, '?>')
    terminal.tblank()
    playerstate.firstfeeling = await terminal.tchoices({gamma:'Pretty well', delta:'...', sigma:'I... who am I?'})
    await terminal.twait(500)
    switch(playerstate.firstfeeling) {
        case 'gamma': terminal.tprint(`?> That's good to hear. Considering that scar, feeling at all is good.`); break;
        case 'delta': terminal.tprint(`?> Yeah, I guess you wouldn't be talking much right now`); break;
        case 'sigma': terminal.tprint(`?> You're, um... well, I guess you got knocked out good, didn't you`); break;
    }
    await terminal.twait(3000)
    terminal.tblank()
    await terminal.tchoicenext('Huh? What happened?')
    await terminal.twait(500)
    if (playerstate.firstfeeling == 'delta') {
        terminal.hprint('?> Oh good, so you <i>can<i> talk!')
        terminal.tblank()
        await terminal.twait(1000)
    }
    terminal.tprint(`?> I don't know, honestly. I found you in the gutter with that massive head wound.
    Your clothes are too nice for you to be homeless, so I brought you back here.`)
    await terminal.twait(2000)
    terminal.tblank()
    let res1 = await terminal.tchoices({
        gamma:"Why would it matter if I was homeless?",
        delta:"Thanks, I guess. Did I have anything on me?",
        sigma:"Did you have any trouble getting me up here?"
    })
    if (res1 == 'sigma') {
        await terminal.twait(500)
        terminal.tprint("?> Not at all. Don't worry about it. Just happy I could help.")
        playerstate.rep.jack += 3
    }
    if (res1 == 'gamma') {
        await terminal.twait(1000)
        terminal.tprint("Your host frowns, and he looks away from you.").classList.add('exposition')
        playerstate.rep.jack += 1
        await terminal.twait(500)
        terminal.tprint(`?> I mean, I can't help everyone, can I? Too many
        bastards in the city for that. You looked like someone I could actually help.`)
        await terminal.twait(1000)
        let followup = await terminal.tchoices({
            gamma:"Yeah, that makes sense. Sorry. I didn't mean to offend you.",
            delta:"...",
            sigma:"Doesn't mean you shouldn't try and help more of them."
        })
        if (followup == "sigma") {
            await terminal.typeprint('Now listen here buddy', 200, "?>")
            await terminal.twait(500)
            playerstate.rep.jack -= 4
            terminal.tprint("Your host looks downright pissed off").classList.add('exposition')
            await terminal.twait(500)
            await terminal.typeprint(`I didn't pick your ass off the street,
            pay out of my own pocket for a doctor to see you without reporting it,
            and look after you for four days just so that you could talk down to me!`, 50, '?>')
            await terminal.tchoicenext("...")
            await terminal.twait(1000)
            await terminal.typeprint("Now... ", 300, '?>')
            await terminal.twait(500)
            terminal.tprint(`?> I'm sure you have more questions`)
        }
    }
    if (res1 != 'delta') {
        if (res1 == 'sigma') {
            terminal.tblank()
            terminal.tprint('You nod, not knowing exactly what he did, but still grateful').classList.add('exposition')
            terminal.tblank()
            await terminal.twait(500)
            await terminal.tchoicenext("That was... nice, of you.")
            await terminal.twait(500)
            terminal.tprint("?> Again, think nothing of it")
            await terminal.twait(500)
            terminal.tblank()
            res1 = await terminal.tchoicenext("My things, then. Was there anything on me me when you found me?")
        }
        if (res1 == 'gamma') {
            terminal.tblank()
            res1 = await terminal.tchoicenext("Well, regardless, did I have anything on me when you found me?")
        }
    }
    if (res1 == 'delta') {
        await terminal.twait(500)
        terminal.tprint("?> Yes, a bag. I have it here.")
        await terminal.twait(500)
        terminal.tblank()
        terminal.tprint(`Your host stands from his chair, and exits the room for a moment.
        When he returns, he has a black backpack in his right hand`).classList.add('exposition')

    }






}
