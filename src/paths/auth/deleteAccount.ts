import pool from "../../pool.js";
import {Request, Response} from "express";

async function deleteAccount(req: Request, res: Response) {
    try {
        if(req.cookies.session) {
            const sessionId = req.cookies.session
            const session = (await pool.query(
                'SELECT user_id, expires FROM sessions WHERE id = $1',
                [sessionId]
            )).rows[0];
            const expires = session?.expires;
            const user_id = session?.user_id;
            if(!session) {
                return res.status(400).json({
                    message: 'Has wrong cookie'
                })
            }
            if(Date.now() > expires) {
                // if sessions expired -> close the session and warn the user
                await pool.query(
                    'UPDATE sessions SET open = false WHERE user_id = $1',
                    [user_id]
                )
                return res.status(403).json({
                    message: 'Session has expired. Log in again'
                })
            }
            res.clearCookie('session')
            // deleting user -> sessions is being deleted itself(on cascade delete)
            await pool.query(
                'DELETE FROM users WHERE id = $1',
                [ user_id ]
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
        console.log(e);
        res.status(500).json({
            message: 'Unexpected issue'
        })
    }
}

export default deleteAccount