import pool from '../pool.js';
async function profile(req, res) {
    try {
        if (req.cookies.session) {
            const sessionId = req.cookies.session;
            const doesntExist = Boolean((await pool.query('SELECT count(*) FROM sessions WHERE id = $1 AND open = true', [sessionId])).rows[0].count == 0);
            if (doesntExist) {
                return res.status(400).json({
                    message: 'Has wrong cookie'
                });
            }
            const { expires, user_id } = (await pool.query('SELECT expires, user_id FROM sessions WHERE id = $1', [sessionId])).rows[0];
            if (Date.now() > expires) {
                await pool.query('UPDATE sessions SET open = false WHERE id = $1', [sessionId]);
                return res.status(403).json({
                    message: 'Session has expired. Log in again'
                });
            }
            const user = (await pool.query('SELECT username, name, lastname, avatar, theme FROM users WHERE id = $1', [user_id])).rows[0];
            res.status(200).json(user);
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
export default profile;
