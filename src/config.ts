const config = {
	development: {
		BASE_API_URL: 'http://localhost:1337',
	},
	production: {
		BASE_API_URL: 'https://our-little-adventures.herokuapp.com',
		GOOGLE_LIBRARY_CLIENT_ID: '424373709-584qmej72pqh8q1m3kpv7om982eh0l3a.apps.googleusercontent.com',
		GOOGLE_LIBRARY_CLIENT_SECRET: 'vjTtKDeFCGQD41PZHd1lBKaV'
	},
}

export default config[process.env.NODE_ENV];
