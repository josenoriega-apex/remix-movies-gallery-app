import { movie } from "~/database/schema";

export type Movie = typeof movie.$inferSelect;
export type MovieDTO = typeof movie.$inferInsert;