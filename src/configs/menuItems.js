import {Window, Person, School, Groups, Chat} from "@mui/icons-material";

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
        title: "User Management",
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
            }, {
                id: 'users-designation',
                title: 'Designation',
                url: "/designations"
            }
        ]
    },

    {
        id: 'academics',
        title: 'Academics',
        icon: <School/>,
        ac: {role: role, permission: 'course.view'},
        children: [
            {
                id: 'academics-courses',
                title: 'Courses',
                url: '/courses',
                ac: {role: role, permission: 'course.view'},
            }, {
                id: 'academics-routine',
                title: 'Routine',
                url: '/routines',
                ac: {role: role, permission: 'routine.view'}
            },
           /* {
                id: 'academics-classes',
                title: 'Classes',
                url: '/classes',
                ac: {role: role, userType: ['teacher', 'student']},
            }*/ {
                id: 'academics-semeseter',
                title: 'Semesters',
                url: '/semesters',
                ac: {role}
            }, {
                id: 'academics-sessions',
                title: 'Sessions',
                url: '/sessions',
                ac: {role},
            },{
                id: 'promotion',
                title: 'Promotion',
                url: '/promotion',
            }
        ]
    },
    {
      id: 'Classmates',
      title: 'Classmates',
      url: '/mates',
    },

    {
      id: 'classrooms',
      title: 'Classroom',
      url: '/c',
    },

    {
        id: 'groups',
        title: 'Groups',
        url: '/g',
        icon: <Groups/>
    }, {
        id: 'chats',
        title: 'Messaging',
        url: '/m',
        icon: <Chat/>,
    }
]
