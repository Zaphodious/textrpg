import * as terminal from './../terminal.js'

export default async function(playerstate) {
    terminal.psudoclear()
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
        terminal.hprint('?> Oh good, so you <i>can</i> talk!')
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
            res1 = await terminal.tchoicenext("Uhh... yeah... what did I have with me? Anything notable?")

        }
    }
    if (res1 == 'delta') {
        await terminal.twait(500)
        terminal.tprint("?> Yes, a bag. I have it here.")
        await terminal.twait(500)
        terminal.tblank()
        terminal.tprint(`Your host stands from his chair, and exits the room for a moment.
        When he returns, he has a black bag in his right hand`).classList.add('exposition')
        let bagchoices = {
            alpha: "Look: The Bag",
            gamma: "Action: Take the bag",
            delta: "Say: No thanks, you can keep whatever's in there. I owe you that much.",
            sigma: "Say: It just occured to me that I haven't gotten your name yet.",
            omega: "Think: Try and remember what's in the bag"
        }
        let has_looked = false
        let has_remembered = false
        let taken_bag = false
        while (!taken_bag) {
            let takebag = await terminal.tchoices(bagchoices)
            switch (takebag) {
                case 'omega':
                    if (has_looked) {
                        terminal.tprint("You remember that you had a small amoung of money in the bag, but also your identification card and some other sentimental items.").classList.add("exposition")
                        terminal.tblank()
                        if ('delta' in bagchoices) {
                            bagchoices.delta = "Say, while taking the bag: You're a good man. Do you want to get a drink? Round's on me."
                        }
                        has_remembered = true
                    } else {
                        terminal.tprint("You don't remember much about the bag. Maybe your ID might have been in there.")
                        terminal.tblank()
                    }
                    delete bagchoices['omega']
                    break
                case "alpha":
                    terminal.tprint(`You look at the bag. It is a black leather backpack closed with straps,
                    that would go well with what you presume is your suit hanging on the wall. There are obviously a few things
                    in the bag, and from how your host is holding the thing it would seem to have some weight to it.`).classList.add("exposition")
                        terminal.tblank()
                    has_looked = true
                    delete bagchoices['alpha']
                    break
                case "delta":
                    if (has_looked && has_remembered) {
                        terminal.tprint("Your host smiles, warmly. He sits down after you take the bag and nods his head").classList.add("exposition")
                        await terminal.twait(1000)
                        terminal.tblank()
                        terminal.tprint("?> I'd like that quite a bit. There's a brewery just down the street. Makes a great lager.")
                        terminal.tblank()
                        taken_bag = true
                    } else {
                        terminal.tprint("Your host looks curiously at you, with a rasied eyebrow and slight frown.").classList.add("exposition")
                        terminal.tblank()
                        terminal.tprint("?> Let's not be rash, now. I appreciatae the gesture but you wouldn't have had this on you if it wasn't important")
                        terminal.tblank()
                        await terminal.twait(2000)
                        terminal.tprint("?> Come to think of it, we might want to call the doctor again later. Regardless, take your bag, friend.")
                        terminal.tblank()
                        delete bagchoices["delta"]
                    }
                    break
                case "gamma":
                    terminal.tprint("You take the bag. Your host sits down, seemingly grateful that the thing is out of his hands.").classList.add("exposition")
                        terminal.tblank()
                    await terminal.twait(1000)
                    terminal.tprint("The bag weighs a fair bit, and it's slightly unbalanced. The buckle holding the top closed is firmly fastened.").classList.add("exposition")
                        terminal.tblank()
                    taken_bag = true
                    break

            }

        }
    }
}