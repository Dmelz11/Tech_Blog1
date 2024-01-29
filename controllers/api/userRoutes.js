// importing
const router = require('express').Router();
const { User } = require('../../models');
// create a new user with router.post
router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create(
            { 
                username: req.body.name,
                password: req.body.password
            });

        req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.user_name = dbUserData.username    
        req.session.logged_in = true;

        res.json(dbUserData);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                name: req.body.name,
            },
        });

        if (!user) {
            res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
            return;
        }

        const validPassword = await user.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
            return;
        }

        req.session.save(() => {
        req.session.user_id = user.id;
        req.session.username = user.name;
        req.session.logged_in = true;

            res.json({ user, message: 'Welcome to the Tech Blog1' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Logout
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
