import _ from './logger.js'
import { WebSocketServer, WebSocket } from 'ws'

export default class WSServer {
	private _wss: WebSocketServer
	private _packetRecievers: PacketReciever[]
	private _connections: WebSocket[]

	constructor(port: number) {
		this._packetRecievers = []

		this._wss = new WebSocketServer({ port: port })

		this._wss.on('connection', _ws => {
			_ws.on('open', async () => {
				this._connections.push(_ws)
				_.info('new connection', 'websocket')
			})

			_ws.on('close', async () => {
				this._connections.filter(ws => ws !== _ws)
				_.info('connection closed', 'websocket')
			})

			_ws.on('error', (err) => {
				_.err(`${err}`, 'websocket')
			})

			_ws.on('message', (data) => {
				const input = data.toString('utf8')
				const packet: Packet = JSON.parse(input)

				this._packetRecievers.forEach(async pr => {
					if (pr.identifier === packet.identifier) _ws.send(Buffer.from(await pr.callback(packet)))
				})
			})
		})

		this._wss.on('listening', () => {
			_.success(`listening on ws://0.0.0.0:${port}`, 'websocket')
		})
	}

	/**
	 * Listen for packets with specific identifier
	 * @param id Identifier of the packet type
	 * @param cb Async callback with packet as argument and response packet as return value
	 */
	public on(id: string, cb: (packet: Packet) => Promise<string>) {
		this._packetRecievers.push({
			identifier: id,
			callback: cb
		})
	}
}

export type Packet = {
	identifier: string,
	data: unknown
}

export type PacketReciever = {
	identifier: string,
	callback: (packet: Packet) => Promise<string>
}