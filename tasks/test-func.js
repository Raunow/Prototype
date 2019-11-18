let rnd = (Math.round(Math.random() * 2));

if (rnd === 1) {
	return `${ctx.name} ${ctx.lname}`;
} else {
	return `${ctx.lname} ${ctx.name}`;
}