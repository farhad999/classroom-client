import {createTheme} from '@mui/material/styles';


// project imports
import componentStyleOverrides from './compStyleOverride';
import {palette} from "./palette";
import themeTypography from './typography';

export const theme = (customization) => {
    // const color = colors;

    const themeOption = {
        colors: palette,
        heading: palette.primary.light,
        paper: palette.paper,
        backgroundDefault: palette.paper,
        background: palette.primary.light,
        darkTextPrimary: palette.grey[700],
        darkTextSecondary: palette.grey[500],
        textDark: palette.grey[900],
        menuSelected: palette.secondary.dark,
        menuSelectedBack: palette.secondary.light,
        divider: palette.grey[200],

    };

    const themeOptions = {
        direction: 'ltr',
        palette: palette,
        mixins: {
            toolbar: {
                minHeight: '48px',
                padding: '16px',
                '@media (min-width: 600px)': {
                    minHeight: '48px'
                }
            }
        },
        typography: themeTypography(themeOption)
    };

    const themes = createTheme(themeOptions);
    themes.spacing(8);
    themes.components = componentStyleOverrides(themeOption);

    return themes;
};

export default theme;
