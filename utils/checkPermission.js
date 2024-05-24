export function checkPermission(permissionName) {
    let userData = localStorage.getItem('userData');
    userData = JSON.parse(userData);
    const userPermissions = userData.thePermissions;
    if (userPermissions && Array.isArray(userPermissions)) {
        return userPermissions.includes(permissionName);
    }
    return false;
}