import {InputAdornment, OutlinedInput} from "@mui/material";
import {Search as SearchIcon} from '@mui/icons-material'
import React from "react";

const Search = ({placeholder, onInput}) => {

    const [input, setInput] = React.useState('');

    const onInputChange = (event) => {
        let value = event.target.value;
        setInput(value);
        onInput(value);
    }

    return (
        <OutlinedInput
            value={input}
            onInput={onInputChange}
            sx={{
            '& fieldset': {
                top: 0
            }
        }} placeholder={placeholder} startAdornment={
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
        }
        />
    )
}

export default Search;
