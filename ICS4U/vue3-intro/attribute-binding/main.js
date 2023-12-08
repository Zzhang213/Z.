const app = Vue.createApp({
   data() {
       return {
           product: 'Socks',
           image: './assets/images/socks_blue.jpg', 
           inStock: true,
           details: ['50% cotton', '30% wool', '20% polyester'],
           sizes: ['S', 'M', 'L', 'XL'],
           colors: [
               { name: 'Blue', image: './assets/images/socks_blue.jpg' },
               { name: 'Green', image: './assets/images/socks_green.jpg' }
           ],
           cart: 0
       }
   },
   methods: {
       addToCart() {
           if (this.inStock) {
               this.cart += 1;
           }
       },
       updateImage(image) {
           this.image = image;
       }
   }
});
