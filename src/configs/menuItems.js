import {Window} from "@mui/icons-material";

export const menuItems = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        url: '/',
        icon: <Window />
    }, {
        id: 'pages',
        title: 'Pages',
        children: [
            {
                id: 'login3',
                title: 'Login',
                type: 'item',
                children: [
                    {
                        id: 'log-2',
                        title: 'Log-34',
                        url: '/log-35'
                    }
                ]
            },

            {
                id: 'register3',
                title: 'Register',
                type: 'item',
                url: '/pages/register/register3',
            }
        ]

    }
]