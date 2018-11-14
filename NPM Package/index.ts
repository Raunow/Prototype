import { writeFile } from 'fs'

class App {
	public subscribe(){

	}
}
try 
{
	throw new Error("test error string");
}
catch (e) {
	var err:string = JSON.stringify(e, Object.keys(e));
}

writeFile(`${__dirname}/test.txt`, err, (error) => {
	if (error){
		console.error(error.stack);
		return;
	}
	console.log("File has been created");
});
