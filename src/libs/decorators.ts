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