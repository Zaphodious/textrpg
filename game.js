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
    terminal.tprint(`?> I don't know, honestly. I found you in the gutter with that massive head wound.`)
    await terminal.twait(6000)
    terminal.tblank()
    terminal.tprint(`?> Your clothes are too nice for you to be homeless, so I brought you back here.`)
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
        if (followup == 'gamma') {
            await terminal.twait(500)
            terminal.tprint(`Your host doesn't stop frowing, but looks back up at you`).classList.add('exposition')
            await terminal.twait(1000)
            terminal.tprint(`?> That's alright. I'm glad I can do anything to help, at all. Most can't. Most wouldn't if they could.`)
            let followup = await terminal.tchoices({
                gamma:"Well, I certainly will be, if I ever have the chance",
                delta:"Maybe you're right. You still did the right thing.",
                sigma:"People are people. We do what we think is best for us."
            })
            await terminal.twait(1000)
            switch (followup) {
                case "gamma":
                    await terminal.twait(500)
                    terminal.tprint(`Your host smiles, just a little.`).classList.add('exposition')
                    playerstate.rep.jack += 3
                    await terminal.twait(1000)
                    terminal.tprint("?> See that you do. It does something wonerful for the soul.")
                    await terminal.tchoicenext("...")
                    break;
                case "delta":
                    await terminal.twait(500)
                    terminal.tprint(`Your host closes his eyes, smiles just a bit, and nods.`).classList.add('exposition')
                    await terminal.twait(500)
                    terminal.tprint(`?> Thank you. Now if every citizen of this city would do the same, we'd lift ourselves out of this muck before year's end`)
                    await terminal.twait(1500)
                    terminal.tblank()
                    terminal.tprint("?> But enough about me. You're the injured party here.")
                    await terminal.twait(500)
                    playerstate.rep.jack += 1
                    break;
            }
            terminal.tprint("Unfortunately you can't stay here forever. Some other poor sod might need helping. Did you have another question before we get you back on your feet?")
            res1 = await terminal.tchoicenext("Yes, did I have anything when you found me?")

        }
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
            await terminal.twait(1000)
            terminal.tprint("Your host calms a little, but his expression is steely").classList.add('exposition')
            await terminal.twait(500)
            res1 = await terminal.tchoicenext("Uhh... yeah... what did I have with me?")

        }
    }
    if (res1 != 'delta') {
        if (res1 == 'sigma') {
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
