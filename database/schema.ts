import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const genre = pgTable("genre", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull().unique(),
});

export const movie = pgTable("movie", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1000 }),
  author: varchar({ length: 200 }).notNull(),
  imageURL: varchar().notNull(),
  year: integer().notNull(),
});

export const movieGenres = pgTable("movie_genres", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  movieId: integer().notNull().references(() => movie.id),
  genreId: integer().notNull().references(() => genre.id),
});
