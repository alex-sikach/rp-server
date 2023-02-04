import profile from './paths/fetch/profile.js'
import register from './paths/auth/register.js'
import deleteAccount from "./paths/auth/deleteAccount.js"
import login from "./paths/auth/login.js"
import logout from './paths/auth/logout.js'
import editTheme from "./paths/edit/theme.js"
import editName from "./paths/edit/name.js";
import editLastname from "./paths/edit/lastname.js"

export default {
    register,
    profile,
    deleteAccount,
    login,
    logout,
    editTheme,
    editName,
    editLastname
}