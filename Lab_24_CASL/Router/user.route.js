const express = require('express');
const userService = require('../Services/UsersServices');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.ability.can('read', 'User')) {
        res.status(403).send({ message: 'You are not allowed to do this!' });
    }
    const users = await userService.GetAll();
    return res.send(users);
});

class User {
    constructor(attrs) {
        Object.assign(this, attrs);
    }
}

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await userService.GetById(id);
    const userS = new User(user.dataValues);
    if (!req.ability.can('read', userS)) {
        return res.status(403).send({ message: 'You are not allowed to do this!' });
    }
    if (!user)
        return res.status(404).send('User not found');
    return res.send(user);
});
module.exports = router;
