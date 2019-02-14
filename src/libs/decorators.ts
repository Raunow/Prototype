import { isNumber } from "util";

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
    if (!target.prototype.__filters) target.prototype.__filters = [];
    switch (type) {
      case "number":
        target.prototype.__filters.push({
          key,
          type: "number",
          args: ["from", "to"]
        });
    }
  };
}
export const CopyTo = (o: any, p: any) => {
  Object.keys(o).map(key => (p[key] = o[key]));
};
