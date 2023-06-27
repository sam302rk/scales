import _ from './logger.js'
import express from 'express'
import { Request, Response } from 'express'
import { readFileSync } from 'fs'
import constants from './constants.js'
import { bitcheck } from './app.js'
import pages from './pages.js'

export default class WebServer {
	private _app: express.Express
	private _pages: Page[]
	private static _LAYOUT = readFileSync('./static/layout/layout.html').toString('utf8')

	constructor(port: number) {
		this._pages = []

		this._app = express()
		this._app.listen(port, () => {
			_.success(`listening on http://0.0.0.0:${port}`, 'webserver')
		})
		this._app.use('/static', express.static('./static'))

		pages.forEach(p => this.addPage(p))
	}

	public addPage(page: Page) {
		this._pages.push(page)

		this._app.get(page.path, async (req: Request, res: Response) => {
			res.status(200).send(WebServer._LAYOUT.replace(/TITLE/g, constants.titleFormat(page.title, constants.title))
				.replace(/BODY/g, page.buildFrom(req))
				.replace(/STYLES/g, Page.buildChildrenStyle(page) + Page.buildStyle(page))
				.replace(/SCRIPTS/g, Page.buildChildrenCode(page) + Page.buildCode(page))
			)
		})
	}
}

export abstract class Element {
	abstract buildFrom(data: unknown): string

	static STYLE = 0x01
	static CODE = 0x10
	static STYLE_AND_CODE = 0x11 

	includes: number
}

export abstract class Component extends Element {
	identifier: string

	static buildStyle(component: Component): string {
		if (bitcheck(component.includes, Element.STYLE)) return `<link rel="stylesheet" href="/static/${component.identifier.replace('.', '/')}/style.css">`
		else return ''
	}

	static buildCode(component: Component): string {
		if (bitcheck(component.includes, Element.CODE)) return `<script src="/static/${component.identifier.replace('.', '/')}/code.js"></script>`
		else return ''
	}
}

export abstract class Page extends Component {
	path: string
	title: string
	children: Component[]

	static buildChildrenStyle(page: Page): string {
		let out = ''
		page.children.forEach(c => out += Component.buildStyle(c))
		return out
	}

	static buildChildrenCode(page: Page): string {
		let out = ''
		page.children.forEach(c => out += Component.buildCode(c))
		return out
	}
}