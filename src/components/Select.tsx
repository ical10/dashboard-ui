import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useId } from 'react';

interface Props {
  label: string;
  options: string[];
  onSelect: (item: string) => void;
  selectedItem?: string;
}

const BasicSelect = ({ label, options, selectedItem, onSelect }: Props) => {
  const id = useId();

  const handleChange = (event: SelectChangeEvent) => {
    onSelect(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={id}>{label}</InputLabel>
        <Select
          labelId={`label for ${id}`}
          id={id}
          value={selectedItem}
          label={label}
          onChange={handleChange}
        >
          {options.map((option, id) => (
            <MenuItem key={`${option}-${id}`} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default BasicSelect;
