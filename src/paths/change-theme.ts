import pool from "../pool.js";
import {Request, Response} from "express";

async function changeTheme(req: Request, res: Response) {
    try {
        const headers = req.headers;
        if(
            headers.cookie?.includes('session')
            && headers?.cookie[ headers?.cookie.indexOf('session')+7 ] === '='
        ) {
            const sessionId = headers.cookie.split('=')[1]
            const { expires, user_id } = (await pool.query(
                'SELECT expires, user_id FROM sessions WHERE id = $1',
                [sessionId]
            )).rows[0]
            if(Date.now() > expires) {
                await pool.query(
                    'UPDATE sessions SET open = false WHERE id = $1',
                    [sessionId]
                )
                return res.status(403).send('Session has expired. Log in again')
            }
            const theme = req.body.theme;
            let valid = false;
            ['classic', 'dark', 'gray', 'christmas'].forEach(e => {
                if(e === theme) {
                    valid = true;
                }
            })
            if(!valid) {
                return res.status(400).send('Bad request! Theme is not valid')
            }
            const exist = Boolean((await pool.query(
                'SELECT count(*) FROM users WHERE id = $1',
                [user_id]
            )).rows[0].count != 0);
            if(!exist) {
                return res.status(400).send('Has wrong cookie')
            } else {
                await pool.query(
                    'UPDATE users SET theme = $1 WHERE id = $2',
                    [theme, user_id]
                )
                res.send('Success')
            }
        } else {
            res.send('Log in first')
        }
    } catch (e) {
        res.status(500).send('Unexpected issue')
        console.log(e);
    }
}

export default changeTheme