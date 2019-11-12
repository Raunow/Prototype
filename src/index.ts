import { createExpress } from './httpTrigger';


async function main() {
	let app = createExpress(PORT);

	app.then(() => console.log(`Server listening on http://localhost:${PORT}/trigger`));
}



let PORT = 80;
main()