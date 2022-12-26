import pool from '../pool.js'
import {Request, Response} from "express";
import {IPublicUser} from "../declaration/interfaces";

async function profile(req: Request, res: Response) {
    try {
        const headers = req.headers;
        if(
            headers.cookie?.includes('session')
            && headers?.cookie[ headers?.cookie.indexOf('session')+7 ] === '='
        ) {
            const sessionId = headers.cookie.split('=')[1]
            const expires = (await pool.query(
                'SELECT expires WHERE id = $1',
                [sessionId]
            )).rows[0]
            if(Date.now() > expires) {
                await pool.query(
                    'UPDATE sessions SET open = false WHERE id = $1',
                    [sessionId]
                )
                return res.status(403).send('Session has expired. Log in again')
            }
            const user_id: number = Number( req.params.user_id );
            const assumed_user = (await pool.query(
                'SELECT username, name, lastname, avatar FROM users WHERE id = $1',
                [user_id]
            )).rows;
            if(!assumed_user.length) {
                return res.status(400).send('Has wrong cookie')
            } else {
                const user: IPublicUser = assumed_user[0]
                res.json(user)
            }
        } else {
            res.send('Log in first')
        }
    } catch (e) {
        res.status(500).send('Unexpected issue')
        console.log(e);
    }
}

export default profile