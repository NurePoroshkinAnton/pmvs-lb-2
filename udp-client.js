const dgram = require("dgram")
const readline = require("readline")

const HOST = "localhost"
const PORT = 3001

const client = dgram.createSocket("udp4")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

client.on("message", (msg) => {
    console.log(`Відповідь сервера: ${msg}`)
    promptUser()
})

client.on("error", (err) => {
    console.error("UDP помилка:", err)
    client.close()
    rl.close()
    process.exit(1)
})

client.on("close", () => {
    console.log("UDP клієнт закрито")
    rl.close()
    process.exit(0)
})

function promptUser() {
    rl.question(
        'Введіть число для перевірки (або "exit" для виходу): ',
        (input) => {
            if (input.toLowerCase() === "exit") {
                console.log("Завершення роботи...")
                client.close()
                return
            }

            const message = Buffer.from(input)
            client.send(message, 0, message.length, PORT, HOST, (err) => {
                if (err) {
                    console.error("Помилка відправки:", err)
                    client.close()
                    return
                }
                console.log(`Відправлено число: ${input}`)
            })
        }
    )
}

console.log("UDP клієнт запущено")
console.log('Введіть число для перевірки (або "exit" для виходу):')
promptUser()

rl.on("close", () => {
    console.log("Клієнт завершив роботу")
    process.exit(0)
})

