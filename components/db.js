import Dexie from "dexie";
const db = new Dexie("weight-calc-database");
db.version(1).stores({ layouts: "++id, &name" });
export default db;