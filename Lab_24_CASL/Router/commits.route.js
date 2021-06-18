const express = require('express');
const commitsService = require('../Services/CommitsServices');
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const commits = await commitsService.GetAll(id);
    return res.send(commits);
});
router.get('/:commitId', async (req, res) => {
    const id = req.params.commitId;
    const commits = await commitsService.GetById(id);
    if (!commits)
        return res.status(404).send('Commits not found');
    return res.send(commits);
});
router.post('/', async (req, res) => {
    try {
        if (!req.ability.can('add', 'Commits')) {
            return res.status(403).send({ message: 'You are not allowed to do this!' });
        }
        const id = req.params.id;
        const commits = await commitsService.AddCommits(id, req.body);
        return res.send(commits);
    } catch (e) {
        console.log(e);
        return res.status(500).send('Server error');
    }
});

class Commit {
    constructor(attrs) {
        Object.assign(this, attrs);
    }
}

router.put('/:commitId', async (req, res) => {
    const id = req.params.commitId;
    const repo = await commitsService.GetById(id, req.body);
    const comRule = new Commit(repo.dataValues);
    if (!req.ability.can('update', comRule)) {
        return res.status(403).send({ message: 'You are not allowed to do this!' });
    }
    const commits = await commitsService.UpdateById(id, req.body);
    console.log(commits);
    if (commits[0] !== 1)
        return res.status(404).send('Commits not found');
    return res.send(req.body);
});
router.delete('/:commitId', async (req, res) => {
    if (!req.ability.can('delete', 'Repos')) {
        return res.status(403).send({ message: 'You are not allowed to do this!' });
    }
    const id = req.params.commitId;
    const commits = await commitsService.DeleteById(id);
    console.log(commits);
    if (!commits)
        return res.status(404).send('Commits not found');
    return res.send({ status: true });
});
module.exports = router;
