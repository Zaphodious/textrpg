import * as terminal from '../terminal.js'
import * as gameutil from '../game_util.js'

let uberns = {terminal, gameutil}

export default async function(playerstate) {
    terminal.psudoclear()
    console.log(uberns)
}

export async function walking_to_sals (playerstate) {
    await terminal.tprint(`The road ahead of you is straight, and very wide, and disappears into the distance.
                           It is filled with people along the sides looking down into their 
                           feeds, and monsterous vehicles careening into and out of the dizzying 
                           depths of the city.`, 
                           'exposition')
    await terminal.tprint(`Along each side, grey buildings rise high
                           into the steel grey sky, so great that no daylight
                           can make its way down to where you stand. The hum of the electric
                           lighting is barely perceptible, but enough to hear if you
                           concentrate.
                           `,
                           'exposition')
    await terminal.tprint(`There is no wrong way to walk through the crowd along either side.`, 'exposition')
    await terminal.tchoicenext('Walk in the direction Jackie indicated', 'exposition')
    await terminal.tprint(`You continue down the road. After some time you notice that you're
                           a little hungry, but the resturaunt is nowhere in sight.`, 'exposition')
    await terminal.tchoicenext('Continue walking...')
    await terminal.tprint(`Your mind wanders during the walk. To what, you don't remember, but
                           when your mind returns to the road before you... surely, 
                           at least an hour has passed.`, 'exposition')
    await terminal.tchoicenext(`Look at your phone's clock`)
    await terminal.tprint(`You've been walking for a total of eleven minutes.`, 'exposition')
    await terminal.tchoicenext('Continue walking...')
    await terminal.tprint(`You resign yourself to your journey. The people around you change, but they might as well all be the same`, 'exposition')
    await terminal.twait(5000)
    terminal.tprint('You see a low-hanging cover over a doorway, a strange sight', 'exposition')
    await terminal.twait(200)
    terminal.tprint('You feel a hand on your shoulder', 'exposition')
    await terminal.twait(200)
    terminal.tprint('You feel yourself being pulled back', 'exposition')
    await terminal.twait(200)
    terminal.tprint('and into darkness', 'exposition')
    await terminal.twait(200)
    await terminal.tchoicenext()
}

export async function getting_picked_up (playerstate) {
    terminal.tprint('haha', 'exposition')
}

export async function foo1(ps) {
    terminal.tprint("from foo1")
    ps.next = "firstfight.bar1"
}

export async function bar1(ps) {
    terminal.tprint("from bar1")
    await terminal.tchoicenext()
}