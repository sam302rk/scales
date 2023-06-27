export default {
	info: (msg: string, prefix = 'global') => console.log(`Info \t(${prefix}) ${msg}`),
	debug: (msg: string, prefix = 'global') => console.log(`Debug \t(${prefix}) ${msg}`),
	success: (msg: string, prefix = 'global') => console.log(`Success (${prefix}) ${msg}`),
	warn: (msg: string, prefix = 'global') => console.error(`WARNING (${prefix}) ${msg}`),
	err: (msg: string, prefix = 'global') => console.error(`ERROR \t(${prefix}) ${msg}`),
}