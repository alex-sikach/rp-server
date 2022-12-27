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
app.post('/register', paths.register)
app.get('/delete-account', paths.deleteAccount)
app.post('/login', paths.login)
app.get('/logout', paths.logout)
app.get('/profile', paths.profile)
app.post('/change-theme', paths.changeTheme)

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