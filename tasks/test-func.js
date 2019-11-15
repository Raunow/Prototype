let rnd = (Math.round(Math.random() * 2));
log(ctx);

if (rnd === 1) {
	log(`${ctx.name} ${ctx.lname}`);
} else {
	log(`${ctx.lname} ${ctx.name}`);
}

