export default {
	title: 'Example',
	titleFormat: (pageTitle: string, title: string) => `${pageTitle} — ${title}`,
	server: {
		port: 8000
	},
	socket: {
		port: 8001
	}
}