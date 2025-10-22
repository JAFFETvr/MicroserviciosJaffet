class Item {
    constructor(id, name, description) {
        if (!name) {
            throw new Error("Item name is required.");
        }
        this.id = id;
        this.name = name;
        this.description = description || '';
    }
}
module.exports = Item;