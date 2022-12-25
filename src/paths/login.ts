import pool from "../pool";
import bcrypt from "bcryptjs";
import {Request, Response} from "express";

async function login(req: Request, res: Response) {
    try {
        const headers = req.headers
        if(headers.cookie?.includes('session')) {
            if (headers.cookie[headers.cookie.indexOf('session') + 7] === '=') {
                const loggedIn = Boolean( (await pool.query(
                    'SELECT count(*) FROM sessions WHERE id = $1 AND open = true',
                    [headers.cookie.split('=')[1]]
                )).rows[0].length !== 0 )
                if(loggedIn) {
                    return res.send('Already logged in')
                }
            }
        }
        const {username, password}:
            {
                username: string,
                password: string
            } = req.body
        const user = (await pool.query(
            'SELECT id, password FROM users WHERE username = $1',
            [username]
        )).rows;
        if(!user.length || !(await bcrypt.compare(password, user[0].password))) {
            return res.status(400).send('Wrong credentials')
        }
        await pool.query(
            'UPDATE TABLE sessions SET open = true WHERE user_id = $1',
            [user[0].id]
        )
        const sessionId = (await pool.query(
            'SELECT id FROM sessions WHERE user_id = $1',
            [user[0].id]
        ))
        res.set('Set-Cookie', `session=${sessionId}`)
        res.send('Success')
    } catch (e) {
        console.log(e)
        res.status(500).send('Unexpected issue')
    }
}

export default login