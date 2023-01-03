import pool from "../pool.js";
import bcrypt from "bcryptjs";
async function login(req, res) {
    try {
        if (req.cookies.session) {
            const sessionId = req.cookies.session;
            const loggedIn = Boolean((await pool.query('SELECT count(*) FROM sessions WHERE id = $1 AND open = true', [sessionId])).rows[0].count != 0);
            if (loggedIn) {
                return res.status(409).json({
                    message: 'Already logged in'
                });
            }
        }
        const { username, password } = req.body;
        const user = (await pool.query('SELECT id, password FROM users WHERE username = $1', [username])).rows;
        if (!user.length || !(await bcrypt.compare(password, user[0].password))) {
            return res.status(400).json({
                message: 'Wrong credentials'
            });
        }
        await pool.query('UPDATE sessions SET open = true WHERE user_id = $1', [user[0].id]);
        const sessionId = (await pool.query('SELECT id FROM sessions WHERE user_id = $1', [user[0].id])).rows[0].id;
        res.cookie('session', sessionId);
        res.status(200).json({
            message: 'Success'
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Unexpected issue'
        });
    }
}
export default login;
