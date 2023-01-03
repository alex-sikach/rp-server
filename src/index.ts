import express, {Express} from "express"
import cors from "cors"
import paths from "./paths.js";
import pool from "./pool.js";

const app: Express = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

// ROUTES
app.post('/api/auth/register', paths.register)
app.get('/api/auth/delete-account', paths.deleteAccount)
app.post('/api/auth/login', paths.login)
app.get('/api/auth/logout', paths.logout)
app.get('/api/auth/profile', paths.profile)
app.post('/api/auth/change-theme', paths.changeTheme)

app.listen(port, async () => {
    try {
        console.log(`server has started on port ${port}`)
        await pool.query(
            'UPDATE sessions SET open = false'
        )
    } catch (e) {
        console.log(e);
    }
});