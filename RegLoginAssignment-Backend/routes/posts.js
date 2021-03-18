const router = require('express').Router();
const verifyJWT = require('../verifyJWT');
router.get('/', verifyJWT.auth, (req, res) => {
    res.json({
        posts : {
            title : 'First post',
            description : 'first post description'
        }
    });
});

module.exports = router;