import React, { useMemo, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, FormControl, InputLabel, Checkbox, ListItemText, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { MovieDTO } from '~/types/movie';
import { genre } from '~/database/schema';

export type NewMovieDTO = MovieDTO & { genres: number[] };

interface MovieFormDialogProps {
  open: boolean;
  genres: typeof genre.$inferSelect[];
  onClose?: () => void;
  onSave?: (movie: NewMovieDTO) => void;
}

const MovieFormDialog = ({ open, onClose, onSave, genres }: MovieFormDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [imageURL, setImageUrl] = useState('');

  const handleGenreChange = (event: { target: { value: number[] | string;  }; }) => {
    if (typeof event.target.value === 'string') return;
    const value = event.target.value;
    setSelectedGenres(value || []);
  };

  const handleSave = () => {
    const newMovie: NewMovieDTO = {
      title,
      description,
      author,
      year: Number(year),
      imageURL,
      genres: selectedGenres.map(idx => genres[idx].id),
    };
    onSave?.(newMovie);
    onClose?.();
  };

  const checkedIndexes = useMemo(() => {
    const selected = new Set(selectedGenres);
    return Array.from({ length: genres.length }).fill(false).map((_, idx) => {
      return selected.has(idx);
    })
  }, [selectedGenres, genres])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Movie Record</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Author"
          type="text"
          fullWidth
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Year"
          type="number"
          fullWidth
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Genres</InputLabel>
          <Select
            multiple
            value={selectedGenres}
            onChange={handleGenreChange}
            renderValue={(selected) => {
              return selected.map(x => genres[x].name).join(', ')
            }}
          >
            {genres.map((genre, idx) => (
              <MenuItem key={genre.id} value={idx}>
                <Checkbox checked={checkedIndexes[idx]} />
                <ListItemText primary={genre.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Image URL"
          type="text"
          fullWidth
          value={imageURL}
          onChange={(e) => setImageUrl(e.target.value)}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovieFormDialog;
