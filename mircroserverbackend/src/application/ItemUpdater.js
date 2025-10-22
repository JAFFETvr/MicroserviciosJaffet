const Item = require('../domain/Item');
class ItemUpdater {
    constructor(repository) { this.repository = repository; }
    async run(id, name, description) {
        const item = new Item(id, name, description);
        await this.repository.update(item);
    }
}
module.exports = ItemUpdater;