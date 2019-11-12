import { createExpress } from './express/app';

async function main() {
	let app = createExpress(PORT);

	app.then(() => console.log(`Server listening on http://localhost:${PORT}/task/`));
}


let PORT = 80;
main()
