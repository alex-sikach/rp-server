import pool from "../../pool.js";
async function editName(req, res) {
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
            const newName = req.body.name;
            const regex = /^[a-zA-Z0-9 _-]+$/;
            let valid = false;
            if (!newName) {
                valid = false;
            }
            else if (newName.length >= 2 && newName.length <= 25) {
                valid = true;
                if (!regex.test(newName)) {
                    valid = false;
                }
            }
            if (!valid) {
                return res.status(400).json({
                    message: 'The name is not valid'
                });
            }
            await pool.query('UPDATE users SET name = $1 WHERE id = $2', [newName, user_id]);
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
export default editName;
