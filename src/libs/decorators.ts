export function DBColumn(columnName: string) {
	return (target, key) => {
		if (!Object.prototype.hasOwnProperty[`${key}DBColumn`]) {
			Object.defineProperty(target, `${key}DBColumn`, {
				enumerable: true,
				configurable: true,
				value: columnName
			});
		}
	}
}

export function CopyTo(o: any, p: any) {
	Object.keys(o).map(key => p[key] = o[key]);
}