import { useState } from "react";
import {
  Add as AddIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import {
  Button,
  Divider,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { and, eq, ilike, inArray } from "drizzle-orm";
import { useFetcher, useLoaderData, useNavigate, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";

import MovieFormDialog from "~/components/CreateMovie";
import MovieCard from "~/components/Movie";
import { database } from "~/database/context";
import * as schema from "~/database/schema";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const parse = (val: string | null) => {
    if (!val) return;
    const asNum = Number(val);
    return !Number.isNaN ? asNum : undefined;
  };

  const url = new URL(request.url);
  const search = url.searchParams.get('q');
  const year = parse(url.searchParams.get('year'));
  const genre = parse(url.searchParams.get('genre'));

  const genres = await database().select().from(schema.genre);

  const movies = await database()
    .selectDistinctOn(
      [schema.movie.id],
      {
        id: schema.movie.id,
        title: schema.movie.title,
        description: schema.movie.description,
        author: schema.movie.author,
        imageURL: schema.movie.imageURL,
        year: schema.movie.year,
      }
    )
    .from(schema.movie)
    .innerJoin(
      schema.movieGenres, eq(schema.movie.id, schema.movieGenres.movieId)
    ).where(
      and(
        search ? ilike(schema.movie.title, `%${search}%`) : undefined,
        and(
          genre ? eq(schema.movieGenres.genreId, Number(genre)) : undefined,
          year ? eq(schema.movie.year, Number(year)) : undefined,
        )
      )
    );

  const movieGenres = await database()
    .select()
    .from(schema.movieGenres)
    .where(
      inArray(schema.movieGenres.movieId, movies.map(m => m.id)),
    );

  const genreIndexes = genres.reduce<Map<number, number>>((map, item, idx) => {
    map.set(item.id, idx);
    return map;
  }, new Map<number, number>());

  const movieGenreIndexes = movieGenres.reduce<Map<number, typeof schema.genre.$inferSelect[]>>((map, item, idx) => {
    const prev = map.get(item.movieId) || [];
    const genreIdx = genreIndexes.get(item.genreId)!;
    map.set(item.movieId, [...prev, genres[genreIdx]]);
    return map;
  }, new Map<number, typeof schema.genre.$inferSelect[]>());

  const output = {
    genres,
    movies: movies.map((item) => ({
      ...item,
      genres: movieGenreIndexes.get(item.id) || [],
    })),
    filters: {
      search: search || '',
      year,
      genre,
    },
  };

  return output;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const author = formData.get("author") as string;
  const year = Number(formData.get("year"));
  const imageURL = formData.get("imageURL") as string;
  const genreIds = formData.getAll("genres").map(id => Number(id));

  const newMovieId =await database().transaction(async (tx) => {
    const inserted = await tx
      .insert(schema.movie)
      .values({ title, description, author, year, imageURL })
      .returning({ id: schema.movie.id });

    const movieId = inserted[0].id;

    const genreInserts = genreIds.map((genreId) => ({
      movieId,
      genreId,
    }));

    await tx.insert(schema.movieGenres).values(genreInserts);

    return inserted[0].id;
  });

  return newMovieId;
};

function Gallery() {
  const { genres, movies, filters } = useLoaderData<typeof loader>();
  const [formIsOpen, setFormIsOpen] = useState(false);
  const fetcher = useFetcher();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [yearFilter, setYearFilter] = useState<number|undefined>(filters.year);
  const [genreFilter, setGenreFilter] = useState<number|undefined>(filters.genre);

  const navigate = useNavigate();

  const handleAddMovie = async (movie: typeof schema.movie.$inferInsert & { genres: number[] }) => {
    const form = new FormData();
    form.append("title", movie.title);
    form.append("description", movie.description || '');
    form.append("author", movie.author);
    form.append("year", movie.year.toString());
    form.append("imageURL", movie.imageURL);

    if (movie.genres) {
      for (const genreId of movie.genres) {
        form.append("genres", genreId.toString());
      }
    }

    await fetcher.submit(form, { method: "post" });
    await fetcher.load("/gallery");

    setFormIsOpen(false);
  }

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    }

    if (yearFilter && yearFilter > 0) {
      params.set("year", String(yearFilter));
    }

    if (genreFilter && genreFilter > 0) {
      params.set("genre", String(genreFilter));
    }

    console.log({yearFilter, genreFilter});

    navigate(`/gallery?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex mb-5 justify-between gap-5">
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: '100%'
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Movies"
            inputProps={{ "aria-label": "search movies" }}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />

          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

          <FormControl>
            <InputLabel shrink id="year">Year</InputLabel>
            <InputBase
              type="number"
              placeholder="Year"
              sx={{ paddingLeft: 2, paddingTop: 2 }}
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : undefined)}
            >
            </InputBase>
          </FormControl>

          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

          <FormControl>
            <InputLabel id="genre">Genre</InputLabel>
            <Select
              variant="standard"
              id="select"
              disableUnderline
              label="genre"
              defaultValue={3}
              sx={{ paddingLeft: 2, paddingRight: 2 }}
              onChange={(e) => setGenreFilter(Number(e.target.value))}
            >
              <MenuItem key={0} value={0}>All</MenuItem>
              {genres.map((genre) => (
                <MenuItem
                  key={genre.id}
                  value={genre.id}
                  selected={genre.id === genreFilter}
                >
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

          <Button
            variant="text"
            color="primary"
            type="button"
            aria-label="search"
            className="flex gap-2"
            onClick={handleSearch}
          >
            Search
            <SearchIcon />
          </Button>
        </Paper>

        <Button variant="outlined" color="primary" onClick={() => setFormIsOpen(true)}>
          <AddIcon />
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {
          movies.map((item) => <MovieCard {...item}/>)
        }

        {!movies.length && <Typography className="text-center text-black">No results</Typography>}
      </div>

      <MovieFormDialog
        open={formIsOpen}
        onClose={() => setFormIsOpen(false)}
        onSave={handleAddMovie}
        genres={genres}
      />
    </div>
  );
}

export default Gallery;
