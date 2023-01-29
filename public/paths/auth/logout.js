import pool from '../../pool.js';
async function logout(req, res) {
    try {
        if (req.cookies.session) {
            res.clearCookie('session');
            const sessionId = req.cookies.session;
            const exist = (await pool.query('SELECT count(*) FROM sessions WHERE id = $1', [sessionId])).rows[0].count != 0;
            if (!exist) {
                return res.status(400).json({
                    message: 'Has wrong cookie'
                });
            }
            await pool.query('UPDATE sessions SET open = false WHERE id = $1', [sessionId]);
            res.status(200).json({
                message: 'Success'
            });
        }
        else {
            res.status(200).json({
                message: 'Already logged out'
            });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Unexpected issue'
        });
    }
}
export default logout;
