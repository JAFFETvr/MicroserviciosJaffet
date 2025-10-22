const Item = require('../domain/Item');
class ItemCreator {
    constructor(repository) { this.repository = repository; }
    async run(name, description) {
        const item = new Item(null, name, description); 
        return this.repository.save(item); 
    }
}
module.exports = ItemCreator;