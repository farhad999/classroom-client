import React from 'react'
import {Autocomplete, CircularProgress, TextField} from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";

function CustomAutoComplete({url, value, setValue, onSelect, inputLabel, setOptionLabel}) {

    const [open, setOpen] = React.useState(false);

    let [options, setOptions] = React.useState([]);

    let [loading, setLoading] = React.useState(false);

    const onInputChange = async (input) => {
        setLoading(true);
        let res = await axios.get(url + input);
        let {data} = res.data;
        setOptions(data);
        setLoading(false);
    }

    const onItemSelect = (v) => {
        //if value not undefined then control the input
        value && setValue(v);
        onSelect(v);
    }

    return (
        <Autocomplete
            fullWidth={true}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            value={value}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={setOptionLabel}
            options={options}
            loading={loading}
            onChange={(event, value) => onItemSelect(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth={true}
                    onChange={(event) => onInputChange(event.target.value)}
                    label={inputLabel}
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
    url: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
    inputLabel: PropTypes.string,
    setOptionLabel: PropTypes.func.isRequired,
}

export default CustomAutoComplete;