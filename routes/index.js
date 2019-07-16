const express = require('express');
const router = express.Router();

const appRoutes = require('./appRoutes');
const apiRoutes = require('./apiRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/', appRoutes);
router.use('/api', apiRoutes);
router.use('/admin', adminRoutes);

module.exports = router;