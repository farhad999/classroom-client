import React from 'react'
import {Autocomplete, CircularProgress, TextField} from "@mui/material";
import PropTypes from "prop-types";

function CustomAutoComplete({loading, options, onInput, label}) {

    const [open, setOpen] = React.useState(false);

    const onChange = (event, value) => {
      console.log('event', value);
    }

    return (
        <Autocomplete
            fullWidth={true}
            autoComplete={false}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) =>  option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            value={null}
            onChange={onChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth={true}
                    onChange={(event) => onInput(event.target.value)}
                    label="Asynchronous"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />

    )

}

CustomAutoComplete.protoTypes = {
    loading: PropTypes.bool,
    options: PropTypes.array
}

export default CustomAutoComplete;