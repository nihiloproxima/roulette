const express = require('express');
const router = express.Router();

const appRoutes = require('./appRoutes');
const apiRoutes = require('./apiRoutes');
const adminRoutes = require('./adminRoutes');

// router.use('/', appRoutes);
// router.use('/api', apiRoutes);
// router.use('/admin', adminRoutes);
router.get('*', (req, res) => {
	res.status(404).send("La roulette prend du repos.");
	console.log(req.session.login, " requested : ", req.protocol + '://' + req.get('host') + req.originalUrl);
})
module.exports = router;