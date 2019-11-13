let rnd = (Math.round(Math.random() * 2));
log(data);

if (rnd === 1) {
	log(`${data.name} ${data.lname}`);
} else {
	log(`${data.lname} ${data.name}`);
}

