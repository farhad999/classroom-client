export default function componentStyleOverrides(theme) {
    const bgColor = '#fff';
    return {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    borderRadius: '4px',
                    boxShadow: 'unset',
                    '&:hover': {
                        boxShadow: 'unset'
                    }
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: theme.textDark,
                    '&::placeholder': {
                        color: theme.darkTextSecondary,
                        fontSize: '0.875rem'
                    }
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: bgColor,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.colors?.grey[400]
                    },
                    '&:hover notchedOutline': {
                        borderColor: theme.colors?.primary.main,
                    },
                    '&.MuiInputBase-multiline': {
                        padding: 1
                    }
                },
                input: {
                    fontWeight: 500,
                    background: bgColor,
                    padding: '15.5px 14px',
                    '&.MuiInputBase-inputSizeSmall': {
                        padding: '10px 14px',
                        '&.MuiInputBase-inputAdornedStart': {
                            paddingLeft: 0
                        }
                    }
                },
                inputAdornedStart: {
                    paddingLeft: 4
                },
            }
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: theme.divider,
                    opacity: 1
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    color: theme.colors?.paper,
                    background: theme.colors?.primary[700]
                }
            }
        },
    }
}
