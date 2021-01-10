import * as terminal from './../terminal.js'

export default async function(playerstate) {
    terminal.psudoclear()
    await terminal.twait(3000)
    await terminal. dtypeprint(' hey', 600, '?')
    await terminal.tchoicenext('...')
    await terminal.dtypeprint(' How are you feeling?', 100, '?')
    playerstate.firstfeeling = await terminal.tchoices({gamma:'Pretty well', delta:'...', sigma:'I... who am I?'})
    await terminal.twait(500)
    switch(playerstate.firstfeeling) {
        case 'gamma': terminal.dprint('?', `That's good to hear. Considering that scar, feeling at all is good.`); break;
        case 'delta': terminal.dprint(`?`, `Yeah, I guess you wouldn't be talking much right now`); break;
        case 'sigma': terminal.dprint(`?`, `You're, um... well, I guess you got knocked out good, didn't you`); break;
    }
    await terminal.tchoicenext('Huh? What happened?')
    if (playerstate.firstfeeling == 'delta') {
        terminal.hprint(`?`, ` Oh good, so you <i>can</i> talk!`)
        await terminal.twait(1000)
    }
    terminal.dprint(`?`,`I don't know, honestly. I found you in the gutter with that massive head wound.`)
    await terminal.tchoicenext()
    terminal.dprint(`?`,`Your clothes are too nice for you to be homeless, so I brought you back here.`)
    await terminal.twait(2000)
    let res1 = await terminal.tchoices({
        gamma:"Why would it matter if I was homeless?",
        delta:"Thanks, I guess. Did I have anything on me?",
        sigma:"Did you have any trouble getting me up here?"
    })
    if (res1 == 'sigma') {
        await terminal.dprint("?","Not at all. Don't worry about it. Just happy I could help.")
        playerstate.rep.jack += 3
        terminal.tprint('You nod, not knowing exactly what he did, but still grateful', 'exposition')
        await terminal.tchoicenext("That was... nice, of you.")
        await terminal.dprint("?","Again, think nothing of it")
        res1 = await terminal.tchoicenext("My things, then. Was there anything on me me when you found me?")
    }
    if (res1 == 'gamma') {
        await terminal.twait(1000)
        await terminal.tprint("Your host frowns, and he looks away from you.", 'exposition')
        playerstate.rep.jack += 1
        terminal.dprint(`?`,`I mean, I can't help everyone, can I? Too many
        bastards in the city for that. You looked like someone I could actually help.`)
        await terminal.twait(1000)
        let followup = await terminal.tchoices({
            gamma:"Yeah, that makes sense. Sorry. I didn't mean to offend you.",
            delta:"...",
            sigma:"Doesn't mean you shouldn't try and help more of them."
        })
        switch (followup) {
            case "gamma":
                await terminal.tprint(`Your host doesn't stop frowing, but looks back up at you`, 'exposition')
                await terminal.dprint(`?`,`That's alright. I'm glad I can do anything to help, at all. Most can't. Most wouldn't if they could.`)
                let followup = await terminal.tchoices({
                    gamma:"Well, I certainly will be, if I ever have the chance",
                    delta:"Maybe you're right. You still did the right thing.",
                    sigma:"People are people. We do what we think is best for us."
                })
                await terminal.twait(1000)
                switch (followup) {
                    case "gamma":
                        await terminal.twait(500)
                        await terminal.tprint(`Your host smiles, just a little.`, 'exposition')
                        playerstate.rep.jack += 3
                        await terminal.dprint("?","See that you do. It does something wonerful for the soul.")
                        await terminal.tchoicenext("...")
                        break;
                    case "delta":
                        await terminal.tprint(`Your host closes his eyes, smiles just a bit, and nods.`, 'exposition')
                        await terminal.dprint(`?`,`Thank you. Now if every citizen of this city would do the same, we'd lift ourselves out of this muck before year's end`)
                        await terminal.twait(1500)
                        await terminal.dprint("?","But enough about me. You're the injured party here.")
                        playerstate.rep.jack += 1
                        break;
                }
                terminal.tprint("?","Unfortunately you can't stay here forever. Some other poor sod might need helping. Did you have another question before we get you back on your feet?")
                res1 = await terminal.tchoicenext("Yes, did I have anything when you found me?")
                break
            case "delta":
                await terminal.dprint("?", "Well, I suppose you'll want to know if you had anything with you, yes?")
                await terminal.tchoicenext("Well, yeah, did I?")
                res1 = 'delta'
                break
            case "sigma":
                await terminal.dtypeprint('Now listen here buddy', 200, "?>")
                await terminal.twait(500)
                playerstate.rep.jack -= 4
                await terminal.tprint("Your host looks downright pissed off", 'exposition')
                await terminal.typeprint(`I didn't pick your ass off the street,
                pay out of my own pocket for a doctor to see you without reporting it,
                and look after you for four days just so that you could talk down to me!`, 50, '?>')
                await terminal.tchoicenext("...")
                await terminal.twait(1000)
                await terminal.dtypeprint("Now... ", 300, '?')
                await terminal.twait(500)
                await terminal.dprint(`?`,`I'm sure you have more questions`)
                await terminal.twait(500)
                terminal.tprint("Your host calms a little, but his expression is steely", 'exposition')
                await terminal.twait(500)
                res1 = await terminal.tchoicenext("Uhh... yeah... what did I have with me? Anything notable?")
                break
        }
    }
    if (res1 == 'delta') {
        await terminal.dprint("?","Yes, a bag. I have it here.")
        terminal.tprint(`Your host stands and exits the room for a moment.
        When he returns, he has a black bag in his right hand`, 'exposition')
        await terminal.tchoicenext()
        terminal.tprint(`You sit up, careful not to go too fast. The side of your head hurts quite a bit, and as you lift
                         your head from your pillow you can feel your heart beating in it`, 'exposition')
        let bagchoices = {
            alpha: "[Look at the bag]",
            gamma: "[Take the bag]",
            delta: "No thanks, you can keep whatever's in there. I owe you that much.",
            sigma: "[Look around the room]",
            omega: "[Try and remember what's in the bag]"
        }
        let has_looked = false
        let has_remembered = false
        let taken_bag = false
        while (!taken_bag) {
            let takebag = await terminal.tchoices(bagchoices)
            switch (takebag) {
                case "sigma":
                    terminal.tprint(`You're in a tiny apartment, on a bed in what could have
                                        been a closet in a larger home. Your host is seated on a
                                        plush but threadbear antique-style sitting-room
                                        chair. The wallpaper looks like it was picked out
                                        by someone who thought that "gaudy" was a desirable
                                        aesthetic, and there are clothes and random piles
                                        of clutter on various surfaces that you can see. Hanging
                                        from the wall is a scuffed but handsom suit that
                                        looks like it would be too small for your host, but
                                        just the right size for you.`, 'exposition')
                    delete bagchoices.sigma
                    await terminal.tchoicenext("Continue...")
                    break
                case 'omega':
                    if (has_looked) {
                        terminal.tprint("You remember that you had a small amoung of money in the bag, but also your identification card and some other sentimental items.", 'exposition')
                        if ('delta' in bagchoices) {
                            bagchoices.delta = "Say, while taking the bag: You're a good man. Do you want to get a drink? Round's on me."
                        }
                        has_remembered = true
                    } else {
                        terminal.tprint("You don't remember much about the bag. Maybe your ID might have been in there.", 'exposition')
                    }
                    delete bagchoices['omega']
                    break
                case "alpha":
                    terminal.tprint(`You look at the bag. It is a black leather backpack closed with straps,
                    that would go well with what you presume is your suit hanging on the wall. There are obviously a few things
                    in the bag, and from how your host is holding the thing it would seem to have some weight to it.`, 'exposition')
                    has_looked = true
                    delete bagchoices['alpha']
                    break
                case "delta":
                    if (has_looked && has_remembered) {
                        terminal.tprint("Your host smiles, warmly. He sits down after you take the bag and nods his head", 'exposition')
                        await terminal.twait(1000)
                        terminal.dprint("?> I'd like that quite a bit. There's a brewery just down the street. Makes a great lager...")
                        await terminal.twait(1000)
                        terminal.tprint("... but later. For now, we need to make sure you can even get out the door")
                        taken_bag = true
                        playerstate.rep.jack += 5
                        playerstate.flags.jack.getadrink = true
                    } else {
                        terminal.tprint("Your host looks curiously at you, with a rasied eyebrow and slight frown.", 'exposition')
                        terminal.dprint("?","Let's not be rash, now. I appreciatae the gesture but you wouldn't have had this on you if it wasn't important")
                        await terminal.twait(2000)
                        terminal.dprint("?","Come to think of it, we might want to call the doctor again later. Regardless, take your bag, friend.")
                        delete bagchoices["delta"]
                    }
                    break
                case "gamma":
                    terminal.tprint("You take the bag. Your host sits down, seemingly grateful that the thing is out of his hands.", 'exposition')
                    await terminal.twait(1000)
                    terminal.tprint("The bag weighs a fair bit, and it's slightly unbalanced. The buckle holding the top closed is firmly fastened.", 'exposition')
                    taken_bag = true
                    break
            }
        }
        playerstate.bag = {
            "Cellphone":1,
            "Mysterious Black Box":1,
            "Meal Bar": 3,
            "Broken Laptop": 1,
            "Money": 126

        }
        await terminal.tchoicenext()
        await terminal.dprint('?', "Alright, let's get you back on your feet.")
        await terminal.twait(500)
        terminal.tprint(`A familiar tune plays from your bag. Reaching in you find the source- an old style
                         flip phone.`, 'exposition')
        let answered_phone = false
        let waitcount = 0
        let hangupcount = 0
        let answerchoices_obj = {
                alpha: "[Wait]",
                gamma: "[Consider the Caller ID]",
                delta: "[Answer it]",
                sigma: "Do you mind if I take this?",
                omega: "Hang Up"
            }
        while (!answered_phone) {
            let answerchoice = await terminal.tchoices(answerchoices_obj)
            switch (answerchoice) {
                case "alpha":
                    if (waitcount == 0) {
                        terminal.tprint(`You wait, and the phone keeps ringing.`, 'exposition')
                        answerchoices_obj.alpha = "[Wait, more]"
                    } else if (waitcount < 3) {
                        terminal.tprint("You wait, longer. The ringing stops.", 'exposition')
                        await terminal.tchoicenext()
                        terminal.tprint("The ringing starts again", 'exposition')
                    } else if (waitcount < 5) {
                        terminal.tprint(`The ringing stops, then starts again.`, 'exposition')
                        terminal.dprint("?","They're probably going to keep calling")
                        answerchoices_obj.alpha = "[Wait, more]"
                    } else {
                        terminal.dprint("?","At this point, you should probably just answer it.")
                        delete answerchoices_obj.alpha
                    }
                    waitcount++
                    console.log(waitcount)
                    break
                case "gamma":
                    terminal.tprint("The Caller ID shows 'Unknown Caller'", 'exposition')
                    delete answerchoices_obj.gamma
                    break
                case "delta":
                    answered_phone = true
                    break
                case "sigma":
                    if (hangupcount > 0 || waitcount > 0) {
                        terminal.dprint("?","Are you daft? Yes, please answer it!")
                        playerstate.rep.jack-=5
                    } else {
                        terminal.dprint("?","Not at all, go right ahead")
                        playerstate.rep.jack+=2
                    }
                    delete answerchoices_obj.sigma
                    break
                case "omega":
                    if (hangupcount == 0) {
                        terminal.tprint(`You press the red "hang up" button.`, 'exposition')
                        await terminal.tchoicenext()
                    } else if (hangupcount < 3) {
                        terminal.tprint(`You press the red "hang up" button.`, 'exposition')
                        await terminal.twait(500)
                        if (waitcount != 0) {
                            terminal.dprint("?","I don't think that hanging up will work")
                        } else {
                            terminal.dprint("?","They're not going to stop calling")
                        }
                        await terminal.tchoicenext()
                    } else {
                        terminal.dprint("?","This is getting very frustrating. Would you just answer it?")
                    }
                    terminal.tprint(`The phone starts ringing again`, 'exposition')
                    hangupcount++
                    break
            }

        }
        terminal.tprint(`You click 'answer', and hold the phone to your face.`, 'exposition')
        if (hangupcount || waitcount) {
            await terminal.dprint(`Caller`,`Bloody hell man that took you long enough!`)
        } else {
            await terminal.dprint(`Caller`,`Hey! Good morning!`)
        }
        terminal.dprint(`Caller`,`Did you forget that we were meeting at Sal's? I've been here for half an hour! Where are you?`)
        let nextchoice = await terminal.tchoices({
            gamma:"Yeah, I'll be there in a minute, sorry man.",
            delta:"...",
            sigma:"Wait a sec, who is this?"
        })
        let going_there = true
        let them_coming_here = false
        let friend_concerned = false
        switch (nextchoice) {
            case "gamma": 
                await terminal.dprint("Caller","Alright dude, no worries, just please hurry up. I can't stay here much longer.")
                await terminal.tprint(`Click. They hang up.`, 'exposition')
                break
            case "delta":
                await terminal.dprint("Caller","Are you there man? Hello? Ahhh, whatever, if you can hear me, be down here soon!")
                await terminal.tprint(`Click. They hang up.`, 'exposition')
                break
            case "sigma":
                await terminal.dprint("Caller","Are... are you serious? Dude. Are you okay? Where are you? Tell me. I'm coming to get you.")
                friend_concerned = true
                let a = await terminal.tchoices({
                    gamma: "It's fine, don't worry. I'll see you at Sal's in a few minutes.",
                    sigma: "[Say to your host] What's the address, here?"
                })
                switch (a) {
                    case "gamma":
                        await terminal.dprint("Caller","Alright... okay. I'll see you here in a few minutes.")
                        await terminal.tchoicenext("Okay. See you there.")
                        await terminal.tprint(`Click. They hang up.`, 'exposition')
                        break
                    case "sigma":
                        await terminal.dprint("?","1256 Diannao Street. Do you have someone coming to pick you up?")
                        await terminal.dprint("Caller","Alright, I heard that. I'll be there in five minutes.")
                        await terminal.tprint(`Click. They hang up.`, 'exposition')
                        going_there = false
                        them_coming_here = true
                        await terminal.tchoicenext(`Uhh... I guess so, yeah.`)
                        break
                }
                break
        }
        console.log(going_there, them_coming_here, friend_concerned)
        await terminal.dprint(`?`,`Alright, perfect! Here, let me put my contact details into that phone,
                         then we'll get you all set up.`)
        await terminal.tprint(`They take your phone, fiddle with it for a moment, and hands it back to you`, 'exposition')
        await terminal.tchoicenext("[Look at the phone]")
        terminal.tprint(`The entry says "Jackie Dorsett", and his phone number.`, 'exposition')
        await terminal.tchoicenext(`Thank you, Jackie`)
        await terminal.dprint("Jackie","Really, don't mention it. Let's get you out the door, shal we.")
        await terminal.tchoicenext()
        await terminal.tprint(`You both get up, Jackie leaves, and you get dressed. Moments later Jackie shows
                         you out, and you enter into a busy, crowded street. As shabby as the
                         apartment was, you figure that it must have some good insulation.`, 'exposition')
        await terminal.tchoicenext()
        if (going_there) {
            await terminal.dprint("Jackie","Oh, by the way, Sal's is just a few blocks down from here. Walk down that road, you can't miss it.")
        }
        playerstate.going_to_sals = going_there
        playerstate.getting_picked_up = them_coming_here
        playerstate.flags.stages.wakeup = true
    }
}