import * as terminal from './terminal.js'

function main(){
    terminal.tprint('Welcome to the Dungeon')
    terminal.tprint('I hope you\'ve brought your sword')
}

async function test1() {
    while (true) {
        let bname = await terminal.buttonpipe.take()
        console.log(bname)
    }
}

main()