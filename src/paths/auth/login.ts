import pool from "../../pool.js";
import bcrypt from "bcryptjs";
import {Request, Response} from "express";
import {IAllUserData} from "../../declaration/interfaces";

async function login(req: Request, res: Response) {
    try {
        if (req.cookies.session) {
            const sessionId = req.cookies.session
            const session = (await pool.query(
                'SELECT expires, open, user_id FROM sessions WHERE id = $1',
                [sessionId]
            )).rows[0];
            const expires = Number(session?.expires);
            const open = session?.open;
            const id = Number(session?.user_id);
            if(!session) {
                return res.status(400).json({
                    message: 'Has wrong cookie'
                })
            }
            if(open && Date.now() < expires) {
                const user = (await pool.query(
                    'SELECT username, name, lastname, avatar, theme FROM users WHERE id = $1',
                    [id]
                )).rows[0];
                const {password} = req.body
                const data: IAllUserData = {...user, id, password, expires}
                return res.status(200).json({
                    message: 'Already logged in',
                    data
                })
            }
        }
        const {username, password}:
            {
                username: string,
                password: string
            } = req.body
        const user = (await pool.query(
            'SELECT id, password, avatar, name, lastname, theme FROM users WHERE username = $1',
            [username]
        )).rows;
        if (!user.length || !(await bcrypt.compare(password, user[0].password))) {
            return res.status(400).json({
                message: 'Wrong credentials'
            })
        }
        const expires = Date.now() + (1*24*60*60*1000) // expires in 1 day(milliseconds)
        await pool.query(
            'UPDATE sessions SET expires = $1, open = true WHERE user_id = $2',
            [expires, user[0].id]
        )
        const sessionId = (await pool.query(
            'SELECT id FROM sessions WHERE user_id = $1',
            [user[0].id]
        )).rows[0].id
        res.cookie('session', sessionId, {
            expires: new Date(expires)
        })
        const userData: IAllUserData = {
            username: username,
            password: password,
            expires: expires,
            id: user[0].id,
            avatar: user[0].avatar,
            name: user[0].name,
            lastname: user[0].lastname,
            theme: user[0].theme
        }
        res.status(200).json({
            message: 'Success',
            data: userData
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Unexpected issue'
        })
    }
}

export default login