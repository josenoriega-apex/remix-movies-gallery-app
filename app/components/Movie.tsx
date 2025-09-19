import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
} from '@mui/material';
import { type genre } from '~/database/schema';
import type { Movie } from '~/types/movie';

interface IMovieProps extends Movie {
  genres: typeof genre.$inferSelect[];
}

function MovieCard({
  title,
  description,
  year,
  imageURL,
  author,
  genres
}: IMovieProps) {
  return (
    <Card >
      <CardMedia
        sx={{ height: 500, backgroundSize: 'contain', backgroundColor: '#f0f0f0' }}
        image={imageURL}
        title={title}
      />

      <CardContent>
        <Typography variant='caption'>
          {year} | {author}
        </Typography>
        <div className="flex justify-between">
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>

          <div className="flex gap-1">
            {genres.map((genre) => (
              <Chip key={genre.id} label={genre.name} size="small" className="ml-1" />
            ))}
          </div>
        </div>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default MovieCard;
