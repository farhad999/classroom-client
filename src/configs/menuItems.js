import {Window, Person} from "@mui/icons-material";

export const menuItems = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        url: '/',
        icon: <Window/>
    }, {
        id: 'users',
        title: "Users",
        icon: <Person/>,
        children: [
            {
                id: 'users-student',
                title: 'Students',
                url: '/users/student'
            }, {
                id: 'users-teacher',
                title: 'Teachers',
                url: '/users/teacher'
            }, {
                id: 'users-stuff',
                title: 'Stuffs',
                url: '/users/stuff'
            }
        ]
    }, {
        id: 'courses',
        title: 'Courses',
        url: '/courses'
    }, {
        id: 'routine',
        title: 'Routine',
        url: '/routines'
    }, {
        id: 'classes',
        title: 'Classes',
        url: '/classes',
    }
]