class ItemDeleter {
    constructor(repository) { this.repository = repository; }
    async run(id) {
        await this.repository.delete(id);
    }
}
module.exports = ItemDeleter;