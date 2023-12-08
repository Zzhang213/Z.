const myStoreApp = Vue.createApp({
   data() {
       return {
           itemCount: 0,
           itemName: 'Footwear',
           brandName: 'Vue Boutique',
           activeVariantIndex: 0,
           isOnSale: false,
           itemDetails: ['50% cotton', '30% wool', '20% polyester'],
           itemVariants: [
               { id: 2234, variantColor: 'green', variantImage: './assets/images/socks_green.jpg', stock: 50 },
               { id: 2235, variantColor: 'blue', variantImage: './assets/images/socks_blue.jpg', stock: 0 },
           ]
       }
   },
   methods: {
       addItemToCart() {
           this.itemCount += 1;
       },
       changeImage(selectedImage) {
           this.variantImage = selectedImage;
       },
       selectVariant(index) {
           this.activeVariantIndex = index;
       }
   },
   computed: {
       fullTitle() {
           return `${this.brandName} ${this.itemName}`;
       },
       currentImage() {
           return this.itemVariants[this.activeVariantIndex].variantImage;
       },
       isAvailable() {
           return this.itemVariants[this.activeVariantIndex].stock;
       },
       saleStatus() {
           return this.isOnSale ? `${this.brandName} ${this.itemName} is on sale.` : '';
       }
   }
});

const mountedStoreApp = myStoreApp.mount('#app');
