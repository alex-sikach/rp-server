import pool from "../pool.js";
async function changeTheme(req, res) {
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
            const theme = req.body.theme;
            let valid = false;
            ['classic', 'dark', 'gray', 'christmas'].forEach(e => {
                if (e === theme) {
                    valid = true;
                }
            });
            if (!valid) {
                return res.status(400).json({
                    message: 'Bad request! Theme is not valid'
                });
            }
            await pool.query('UPDATE users SET theme = $1 WHERE id = $2', [theme, user_id]);
            res.status(200).json({
                message: 'Success'
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
export default changeTheme;
