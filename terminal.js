let terminal = document.getElementById('terminal')
let inputs = document.getElementById('inputs')
console.log(inputs)
console.log(terminal)

export function print_message_to_console(messagecontents) {
    let d = document.createElement('div')
    d.append(messagecontents)
    terminal.append(d)
    terminal.scrollTop = terminal.scrollHeight;
}