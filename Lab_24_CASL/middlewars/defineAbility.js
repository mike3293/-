const { AbilityBuilder, Ability } = require('@casl/ability');
const Role = require('../models/Role');

function defineAbilitiesFor(user) {
    const { can, rules } = new AbilityBuilder(Ability);
    console.log(user);
    if (user.role === Role.Guest) {
        can('read', 'Repos');
        can('read', 'Commits');
    }
    if (user.role === Role.User) {
        can('read', 'User', { id: user.id });
        can('read', 'Repos');
        can('read', 'Commits');
        can('add', 'Commits');
        can('add', 'Repos');
        can('update', 'Commit', { userId: user.id });
        can('update', 'Repos', { userId: user.id });
    }
    if (user.role === Role.Admin) {
        can('manage', 'all');
    }
    return new Ability(rules);
}

module.exports = function createAbilities(req, res, next) {
    req.ability = defineAbilitiesFor(req.user);
    next();
};
