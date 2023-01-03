import pool from '../pool.js';
async function logout(req, res) {
    try {
        if (req.cookies.session) {
            const sessionId = req.cookies.session;
            await pool.query('UPDATE sessions SET open = false WHERE id = $1', [sessionId]);
            res.clearCookie('session');
            res.status(200).json({
                message: 'Success'
            });
        }
        else {
            res.status(409).json({
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
