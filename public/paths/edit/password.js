import pool from '../../pool.js';
import bcrypt from "bcryptjs";
async function editPassword(req, res) {
    try {
        if (req.cookies.session) {
            const sessionId = req.cookies.session;
            const session = (await pool.query('SELECT user_id, expires FROM sessions WHERE id = $1', [sessionId])).rows[0];
            const expires = session?.expires;
            const user_id = session?.user_id;
            if (!session) {
                return res.status(400).json({
                    message: 'Has wrong cookie'
                });
            }
            if (Date.now() > expires) {
                // is session expired -> close the one and warn the user
                await pool.query('UPDATE sessions SET open = false WHERE id = $1', [sessionId]);
                return res.status(403).json({
                    message: 'Sessions has expired. Log in again'
                });
            }
            const newPassword = req.body.password;
            if (newPassword === undefined || newPassword.length < 8) {
                return res.status(400).json({
                    message: 'The password is not valid'
                });
            }
            const hash = (await bcrypt.hash(newPassword, 5));
            await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hash, user_id]);
            res.status(200).json({
                message: 'Success',
                data: { password: newPassword }
            });
        }
        else {
            res.status(401).json({
                message: 'Log in first'
            });
        }
    }
    catch (e) {
        res.status(500).json({
            message: 'Unexpected issue'
        });
        console.log(e);
    }
}
export default editPassword;
