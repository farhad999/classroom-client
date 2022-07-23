import {Window, Person} from "@mui/icons-material";

//ac => access control if

const role = 'SuperAdmin';

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
        ac: {role: role, permission: 'users.view'},
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
        url: '/courses',
        ac: {role: role, permission: 'course.view'},
    }, {
        id: 'routine',
        title: 'Routine',
        url: '/routines',
        ac: {roles: role, permission: 'routine.view'}
    }, {
        id: 'classes',
        title: 'Classes',
        url: '/classes',
        ac: {userType: ['teacher', 'student']},
    }
]