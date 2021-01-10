import * as terminal from '../terminal.js'
import * as gameutil from '../game_util.js'

let uberns = {terminal, gameutil}

export default async function(playerstate) {
    terminal.psudoclear()
    console.log(uberns)
}

export async function walking_to_sals (playerstate) {
    await terminal.tprint(
        `Do-wap she doooo`
    ,'exposition')
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