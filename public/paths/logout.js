import pool from '../pool.js';
async function logout(req, res) {
    try {
        const headers = req.headers;
        if (headers.cookie?.includes('session')
            && headers?.cookie[headers?.cookie.indexOf('session') + 7] === '=') {
            const sessionId = headers.cookie.split('=')[1];
            await pool.query('UPDATE sessions SET open = false WHERE id = $1', [sessionId]);
            // todo: compare this way and res.clearCookie('session')
            res.set('Set-Cookie', 'session=; expires=Thu, 01 Jan 1970 00:00:00 GMT');
            res.send('Success');
        }
        else {
            res.send('Already logged out');
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Unexpected issue');
    }
}
export default logout;
