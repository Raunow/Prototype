let rnd = (Math.round(Math.random() * 2));
log(ctx);

if (rnd === 1) {
	return `${ctx.name} ${ctx.lname}`;
} else {
	return `${ctx.lname} ${ctx.name}`;
}