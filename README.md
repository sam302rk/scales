# Scales ![dashinit compatible](https://img.shields.io/badge/dashinit-compatible-dark_green)
> Most scalable website builder

### Directory tree
- static
	- components
		- <component_name>
			- *style.css*
			- *code.js*
	- pages
		- <page_name>
			- *style.css*
			- *code.js*
	- layout
		- layout.html
		- *style.css*
		- *code.js*

### How to create a Page
#### 1. Create a class called `/src/pages/<page_name>.ts`
```typescript
import { Page } from '../webserver.js'
import { Request } from 'express'

// Import components here

export class ExamplePage /* <-- Change name */ implements Page {
	title = '<page_title>'
	identifier = 'pages.<page_name>'
	path = '/<path>'
	includes = 17 // = Page.STYLE_AND_CODE
	children = [ /* Register components here for style & code to work */ ]

	buildFrom(req: Request): string {
		return `<p>The body belongs here. Use ${<component>.buildFrom(...)} to place components.</p>`
	}
}
```

#### 2. Create `style.css` & `code.js
Create the directory `/static/pages/<page_name>/` and add these files there.
They will be automatically loaded.



### How to create a component
#### 1. Create a class called `/src/components/<component_name>.ts`
```ts
import { Component } from '../webserver.js'

export default class ExampleComponent /* <-- Change name */ implements Component {
	identifier = 'components.<component_name>'
	includes = 1 // = Page.STYLE
	buildFrom(data: unknown): string {
		return `<p class="${this.identifier}">construct your own component here.</p>`
	}
}
```

#### 2. Create a `style.css` in `/static/components/<component_name>/`
```css
.components\.component_name /*query for children here*/ {
	/* Put your css here */
}
```

#### 3. Create a `code.js` in `/static/components/<component_name>/`