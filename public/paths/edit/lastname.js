import pool from "../../pool.js";
async function editLastname(req, res) {
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
                await pool.query('UPDATE sessions SET open = false WHERE user_id = $1', [user_id]);
                return res.status(403).json({
                    message: 'Session has expired. Log in again'
                });
            }
            const newLastname = req.body.lastname;
            const regex = /^[a-zA-Z0-9 _-]+$/;
            let valid = false;
            if (!newLastname) {
                valid = false;
            }
            else if (newLastname.length >= 2 && newLastname.length <= 25) {
                valid = true;
                if (!regex.test(newLastname)) {
                    valid = false;
                }
            }
            if (!valid) {
                return res.status(400).json({
                    message: 'The name is not valid'
                });
            }
            await pool.query('UPDATE users SET lastname = $1 WHERE id = $2', [newLastname, user_id]);
            res.status(200).json({
                message: 'Success'
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
export default editLastname;
