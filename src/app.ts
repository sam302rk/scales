import _ from './logger.js'
import constants from './constants.js'
import WebServer from './webserver.js'
import WSServer, { Packet } from './websocket.js'

const webServer = new WebServer(constants.server.port)
const webSocket = new WSServer(constants.socket.port)

webSocket.on('login', async (packet: Packet) => {
	return packet.identifier
})

export function bitcheck(input: number, bit: number) {
	return (input & bit) == bit
}