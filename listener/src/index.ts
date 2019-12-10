//import { createExpress } from './express/app';
import { Account } from './redis/accountReader';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function main() {
	let temp = new Account('api_develop');
	await temp.init()
	writeFileSync(join(__dirname, '..', 'config\\templates\\public\\api_develop.json'), JSON.stringify(temp, null, '\t'));
	writeFileSync(join(__dirname, '..', 'config\\templates\\public\\temp.json'), JSON.stringify(temp.applications, null, '\t'));

	//let app = createExpress(PORT);

	//app.then(() => console.log(`Server listening on http://localhost:${PORT}/subscription/`));
}

let PORT = 5000;
main();