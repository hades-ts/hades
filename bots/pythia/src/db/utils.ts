import { sql, cosineDistance } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

export const vectorize = (column: AnyPgColumn, embedding: number[]) =>
    sql<number>`1 - (${cosineDistance(column, embedding)})`;
