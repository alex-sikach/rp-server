import pool from '../pool.js';
async function profile(req, res) {
    try {
        if (req.cookies.session) {
            const sessionId = req.cookies.session;
            const session = (await pool.query('SELECT user_id, expires, open FROM sessions WHERE id = $1', [sessionId])).rows[0];
            const expires = session?.expires;
            const open = session?.open;
            const user_id = session?.user_id;
            if (!session) {
                return res.status(400).json({
                    message: 'Has wrong cookie'
                });
            }
            if (open && Date.now() > expires) {
                // if sessions expired -> close the session and warn the user
                await pool.query('UPDATE sessions SET open = false WHERE user_id = $1', [user_id]);
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
