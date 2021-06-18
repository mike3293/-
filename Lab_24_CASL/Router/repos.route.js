const express = require('express');
const reposService = require('../Services/ReposServices');
const router = express.Router({ mergeParams: true });
const commitsRouter = require('./commits.route');

router.get('/', async (req, res) => {
    const repos = await reposService.GetAll();
    return res.send(repos);
});
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const repos = await reposService.GetById(id);
    if (!repos)
        return res.status(404).send('Repos not found');
    return res.send(repos);
});
router.post('/', async (req, res) => {
    try {
        if (!req.ability.can('add', 'Repos')) {
            return res.status(403).send({ message: 'You are not allowed to do this!' });
        }
        const repos = await reposService.AddRepos(req.body);
        return res.send(repos);
    } catch (e) {
        console.log(e);
        return res.status(500).send('Server error');
    }
});

class Repos {
    constructor(attrs) {
        Object.assign(this, attrs);
    }
}

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const repo = await reposService.GetById(id, req.body);
    const repoRule = new Repos(repo.dataValues);
    console.log(repoRule);
    if (!req.ability.can('update', repoRule)) {
        return res.status(403).send({ message: 'You are not allowed to do this!' });
    }
    const repos = await reposService.UpdateById(id, req.body);
    if (repos[0] !== 1)
        return res.status(404).send('Repos not found');
    return res.send(req.body);
});
router.delete('/:id', async (req, res) => {
    if (!req.ability.can('delete', 'Repos')) {
        return res.status(403).send({ message: 'You are not allowed to do this!' });
    }
    const id = req.params.id;
    const repos = await reposService.DeleteById(id);
    console.log(repos);
    if (!repos)
        return res.status(404).send('Repos not found');
    return res.send({ status: true });
});
router.use('/:id/commits/', commitsRouter);
module.exports = router;
