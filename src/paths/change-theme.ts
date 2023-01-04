import pool from "../pool.js";
import {Request, Response} from "express";
import {IPublicUser} from "../declaration/interfaces";

async function changeTheme(req: Request, res: Response) {
    try {
        if (req.cookies.session) {
            const sessionId = req.cookies.session
            const session = (await pool.query(
                'SELECT user_id, expires, open FROM sessions WHERE id = $1',
                [sessionId]
            )).rows[0];
            const expires = session.expires;
            const open = session.open;
            const user_id = session.user_id;
            if (!expires) {
                return res.status(400).json({
                    message: 'Has wrong cookie'
                })
            }
            if (open && Date.now() > expires) {
                // if sessions expired -> close the session and warn the user
                await pool.query(
                    'UPDATE sessions SET open = false WHERE user_id = $1',
                    [user_id]
                )
                return res.status(403).json({
                    message: 'Session has expired. Log in again'
                })
            }
            const theme = req.body.theme;
                let valid = false;
                ['classic', 'dark', 'gray', 'christmas'].forEach(e => {
                    if(e === theme) {
                        valid = true;
                    }
                })
                if(!valid) {
                    return res.status(400).json({
                        message: 'Theme is not valid'
                    })
                }
                await pool.query(
                    'UPDATE users SET theme = $1 WHERE id = $2',
                    [theme, user_id]
                )
                res.status(200).json({
                    message: 'Success'
                })
        } else {
            res.status(401).json({
                message: 'Log in first'
            })
        }
    } catch (e) {
        res.status(500).json({
            message: 'Unexpected issue'
        })
        console.log(e);
    }
}

export default changeTheme