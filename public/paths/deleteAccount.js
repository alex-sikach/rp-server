import pool from "../pool";
async function deleteAccount(req, res) {
    try {
        const headers = req.headers;
        if (headers.cookie?.includes('session')
            && headers?.cookie[headers?.cookie.indexOf('session') + 7] === '=') {
            const sessionId = headers.cookie.split('=')[1];
            const loggedIn = Boolean((await pool.query('SELECT count(*) FROM sessions WHERE id = $1 AND open = true', [sessionId])).rows[0].length !== 0);
            if (!loggedIn) {
                return res.send('Log in first');
            }
            const { user_id } = (await pool.query('SELECT user_id WHERE id = $1', [sessionId])).rows[0];
            await pool.query('UPDATE TABLE sessions SET open = false WHERE id = $1', [sessionId]);
            res.clearCookie('session');
            await pool.query('DELETE FROM users WHERE id = $1', [user_id]);
            res.send('Success');
        }
        else {
            return res.send('Log in first');
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Unexpected issue');
    }
}
export default deleteAccount;
