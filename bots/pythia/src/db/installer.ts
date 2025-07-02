import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Container } from "inversify";
import postgres from "postgres";

export const withDb = () => (container: Container) => {
    const db_url = container.get<string>("cfg.databaseUrl");
    const client = postgres(db_url);
    const db = drizzle(client);
    container.bind(PostgresJsDatabase).toConstantValue(db);
};
