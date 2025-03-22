const net = require("net")
const readline = require("readline")

const HOST = "localhost"
const PORT = 3000

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const client = new net.Socket()

client.connect(PORT, HOST, () => {
    console.log(`Підключено до сервера ${HOST}:${PORT}`)
    promptUser()
})

client.on("data", (data) => {
    console.log(`Відповідь сервера: ${data.toString().trim()}`)
    promptUser()
})

client.on("error", (err) => {
    console.error("Помилка підключення:", err)
    rl.close()
    client.destroy()
})

client.on("close", () => {
    console.log("З'єднання з сервером закрито")
    rl.close()
})

function promptUser() {
    rl.question(
        'Введіть число для перевірки (або "exit" для виходу): ',
        (input) => {
            if (input.toLowerCase() === "exit") {
                console.log("Завершення роботи...")
                client.end()
                return
            }

            client.write(input)
        }
    )
}

process.on("SIGINT", () => {
    console.log("\nЗавершення роботи...")
    client.end()
    rl.close()
})

