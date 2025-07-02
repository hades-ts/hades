import { cosineDistance, sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

export const vectorize = (column: AnyPgColumn, embedding: number[]) =>
    sql<number>`1 - (${cosineDistance(column, embedding)})`;
