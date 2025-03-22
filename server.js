const net = require("net")
const dgram = require("dgram")

function isPalindrome(num) {
    const numStr = num.toString()
    const reversedStr = numStr.split("").reverse().join("")
    return numStr === reversedStr
}

const tcpServer = net.createServer((socket) => {
    console.log("TCP клієнт підключився")

    socket.on("data", (data) => {
        const num = parseInt(data.toString().trim())

        if (isNaN(num)) {
            socket.write("Будь ласка, введіть коректне число\n")
            return
        }

        console.log(`Отримано число через TCP: ${num}`)
        const result = isPalindrome(num) ? "Yes" : "No"
        socket.write(`${result}\n`)
    })

    socket.on("error", (err) => {
        console.error("TCP помилка:", err)
    })

    socket.on("close", () => {
        console.log("TCP клієнт відключився")
    })
})

const udpServer = dgram.createSocket("udp4")

udpServer.on("message", (msg, rinfo) => {
    const num = parseInt(msg.toString().trim())

    if (isNaN(num)) {
        udpServer.send(
            "Будь ласка, введіть коректне число",
            rinfo.port,
            rinfo.address
        )
        return
    }

    console.log(`Отримано число через UDP: ${num}`)
    const result = isPalindrome(num) ? "Yes" : "No"
    udpServer.send(result, rinfo.port, rinfo.address)
})

udpServer.on("error", (err) => {
    console.error("UDP помилка:", err)
    udpServer.close()
})

const TCP_PORT = 3000
const UDP_PORT = 3001

tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP сервер запущено на порту ${TCP_PORT}`)
})

udpServer.bind(UDP_PORT, () => {
    console.log(`UDP сервер запущено на порту ${UDP_PORT}`)
})

console.log("Сервер очікує на підключення...")

