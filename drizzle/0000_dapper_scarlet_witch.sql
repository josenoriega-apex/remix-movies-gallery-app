CREATE TABLE IF NOT EXISTS "genre" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "genre_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	CONSTRAINT "genre_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movie_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" varchar(1000),
	"author" varchar(200) NOT NULL,
	"imageURL" varchar NOT NULL,
	"year" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie_genres" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movie_genres_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"movieId" integer NOT NULL,
	"genreId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_movieId_movie_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movie"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_genreId_genre_id_fk" FOREIGN KEY ("genreId") REFERENCES "public"."genre"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
