//import { createExpress } from './express/app';
import { Account } from './redis/accountReader';
import { promises } from 'fs';
import { join } from 'path';

async function main() {
	let account = new Account('api_develop');
	await account.init()

	await promises.writeFile(
		join(__dirname, '..', 'config\\templates\\public\\api_develop.json'),
		JSON.stringify(account, null, '\t'));

	console.log('done')
	//let app = createExpress(PORT);
	//app.then(() => console.log(`Server listening on http://localhost:${PORT}/subscription/`));
}


let PORT = 5000;
main();
