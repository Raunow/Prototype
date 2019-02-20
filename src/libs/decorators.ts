
export function DBTable(tableName: string) {
  return (target) => {
    target.prototype.DBTable = tableName;
  };
}

export function DBColumn(columnName: string) {
  return (target, key) => {
    if (!Object.prototype.hasOwnProperty[`${key}DBColumn`]) {
      Object.defineProperty(target, `${key}DBColumn`, {
        enumerable: true,
        configurable: true,
        value: columnName
      });
    }
  };
}

export function Filterable(type) {
  return (target, key) => {
    /*if (!target.prototype['__filters']) Object.defineProperty(target, '__filters', {
      enumerable: true,
      configurable: true,
      value: []
    });

    switch (type.ToLower()) {
      case "number":
        target.prototype.__filters.push({
          key,
          type: "number",
          args: ["from", "to"]
        });
        break;
      case "date":
        target.prototype.__filters.push({
          key,
          type: "date",
          args: ["after", "before"]
        });
        break;
      case "string":
        target.prototype.__filters.push({
          key,
          type: "string",
          args: "freeform"
        });
        break;
      default:

        break;
    };*/
  }
}

export const CopyTo = (o: any, p: any) => {
  Object.keys(o).map(key => (p[key] = o[key]));
}
