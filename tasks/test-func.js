let rnd = (Math.round(Math.random() * 2));
log(context);

if (rnd === 1) {
	log(`${context.name} ${context.lname}`);
} else {
	log(`${context.lname} ${context.name}`);
}

