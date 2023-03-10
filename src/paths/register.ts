import pool from "../pool.js";
import {Request, Response} from "express";
import bcrypt from 'bcryptjs'
import {IRegisterBody} from "../declaration/interfaces";
import {v4 as randomSessionId} from 'uuid'

async function register(req: Request, res: Response) {
    try {
        if(req.cookies.session) {
            return res.status(405).json({
                message: "Log out first"
            })
        } else {
            const body: IRegisterBody = req.body;
            if(
                body.name.length < 2
                || body.lastname.length < 2
                || body.username.length < 8
                || body.password.length < 8
            ) {
                return res.status(400).json({
                    message: 'Invalid credentials'
                })
            } else {
                const exist = Boolean((await pool.query(
                    'SELECT count(*) FROM users WHERE username = $1',
                    [body.username]
                )).rows[0].count != 0)
                if(exist) {
                    return res.status(409).json({
                        message: 'Already exists'
                    })
                } else {
                    const hash: string = (await bcrypt.hash(body.password, 5))
                    await pool.query(
                        'INSERT INTO users(username, name, lastname, password) VALUES($1, $2, $3, $4)',
                        [body.username, body.name, body.lastname, hash]
                    )
                    const user_id = Number((await pool.query(
                        'SELECT id FROM users WHERE username = $1',
                        [body.username]
                    )).rows[0].id)
                    const sessionId = (randomSessionId()).slice(0, 100)
                    const expires = Date.now() + (1*24*60*60*1000) // expires in 1 day(milliseconds)
                    await pool.query(
                        'INSERT INTO sessions(id, user_id, open, expires) VALUES($1, $2, false, $3)',
                        [sessionId, user_id, expires]
                    )
                    res.status(200).json({
                        message: 'Success'
                    })
                }
            }
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Unexpected issue'
        })
    }
}

export default register