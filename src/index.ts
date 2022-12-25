import express, {Express, Response, Request} from "express"
import cors from "cors"
import paths from "./paths";

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

app.listen(port, async () => {
    try {
        console.log(`server has started on port ${port}`)
        // todo: deleting all db sessions
        // todo: restarting users_is_seq sequence
    } catch (e) {
        console.log(e);
    }
});