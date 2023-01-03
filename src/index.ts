import express, {Express} from "express"
import paths from "./paths.js";
import pool from "./pool.js";
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from "cookie-parser";

// due to {"type": "module"} in package.json we got neither __dirname nor __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const port = process.env.PORT || 5000;

//middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, '../client-build')))
app.use(cookieParser())

// ROUTES
app.post('/api/auth/register', paths.register)
app.get('/api/auth/delete-account', paths.deleteAccount)
app.post('/api/auth/login', paths.login)
app.get('/api/auth/logout', paths.logout)
app.get('/api/fetch/profile', paths.profile)
app.post('/api/edit/theme', paths.changeTheme)

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