import pool from "../pool.js";
import {Request, Response} from "express";

async function deleteAccount(req: Request, res: Response) {
    try {
        if(req.cookies.session) {
            const sessionId = req.cookies.session
            const loggedIn = Boolean((await pool.query(
                'SELECT count(*) FROM sessions WHERE id = $1 AND open = true',
                [sessionId]
            )).rows[0].count != 0);
            if(!loggedIn) {
                return res.send('Log in first')
            }
            const { user_id } = (await pool.query(
                'SELECT user_id FROM sessions WHERE id = $1',
                [sessionId]
            )).rows[0]
            res.clearCookie('session')
            // deleting user and sessions is being deleted itself(on cascade delete)
            await pool.query(
                'DELETE FROM users WHERE id = $1',
                [ user_id ]
            )
            res.send('Success')
        } else {
            return res.send('Log in first')
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Unexpected issue')
    }
}

export default deleteAccount