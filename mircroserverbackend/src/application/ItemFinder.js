class ItemFinder {
    constructor(repository) { this.repository = repository; }
    async findAll() {
        return this.repository.findAll();
    }
}
module.exports = ItemFinder;