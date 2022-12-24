import express, {Express, Response, Request} from "express"
import cors from "cors"

const app: Express = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

// ROUTES


app.listen(port, async () => {
    try {
        console.log(`server has started on port ${port}`)
        // todo: deleting all db sessions
        // todo: restarting users_is_seq sequence
    } catch (e) {
        console.log(e);
    }
});