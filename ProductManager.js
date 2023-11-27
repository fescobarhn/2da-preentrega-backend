const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.init();
    }

    async init() {
        try {
            await fs.promises.access(this.path);
        } catch (error) {
            await fs.promises.writeFile(this.path, JSON.stringify([]));
        }
    }

    async readProducts() {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async writeProducts(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async addProduct(product) {
        const products = await this.readProducts();
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const newProduct = { ...product, id: newId };
        products.push(newProduct);
        await this.writeProducts(products);
        return newProduct;
    }

    async getProducts() {
        return await this.readProducts();
    }

    async getProductById(id) {
        const products = await this.readProducts();
        return products.find(product => product.id === id) || null;
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.readProducts();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return null;

        products[index] = { ...products[index], ...updatedProduct, id };
        await this.writeProducts(products);
        return products[index];
    }

    async deleteProduct(id) {
        let products = await this.readProducts();
        products = products.filter(product => product.id !== id);
        await this.writeProducts(products);
    }
}

// Exportamos la clase para su uso en otros archivos
module.exports = ProductManager;