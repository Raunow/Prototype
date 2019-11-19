import { createExpress } from './express/app';

async function main() {
	let app = createExpress(PORT);

	app.then(() => console.log(`Server listening on http://localhost:${PORT}/subscription/`));
}

let PORT = 4000;
main();