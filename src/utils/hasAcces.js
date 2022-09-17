export const hasAccess = (user, item) => {

    const accessControl = item && item.ac;

    if (!accessControl) {
        return true;
    }

    const {permission, role, userType} = accessControl;

   // console.table({'userRoles': user.roles, 'reqRoles': role});

   // console.log('user', user);

    if (role && user.role === role) {
        return true;
    } else if (permission && user.permissions.some(perm => permission.includes(perm))) {
        return true
    } else if (userType && userType.includes(user.userType)) {
        return true;
    }
    return false;

}