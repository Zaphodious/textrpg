import {print_message_to_console} from './terminal.js'

function main(){
    console.log("This is the game")
    print_message_to_console('Hello there')
    print_message_to_console('Fancy a drink?')
    for (let i = 0; i<80; i++) {
        let message = `line length:${i+14}`
        for (let j = 0; j<i; j++) {
            message += '-'
        }
        print_message_to_console(message)
    }
}

main()