app.component('product-display', {
   props: {
      premium: {
         type: Boolean,
         required: true
      }
   },
   template:
      /*html*/
      `<div class="product-display">
    <div class="product-container">
      <div class="product-image">
        <img v-bind:src="image">
      </div>
      <div class="product-info">
        <h1>{{ title }}</h1>

        <p v-if="inStock">In Stock</p>
        <p v-else>Out of Stock</p>

        <p>Shipping: {{ shipping }}</p>
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <div 
          v-for="(variant, index) in variants" 
          :key="variant.id" 
          @mouseover="updateVariant(index)" 
          class="color-circle" 
          :style="{ backgroundColor: variant.color }">
        </div>
        
        <button 
          class="button" 
          :class="{ disabledButton: !inStock }" 
          :disabled="!inStock" 
          v-on:click="addToCart">
          Add to Cart
        </button>

      </div>
    </div>
    <review-list v-if="reviews.length" :reviews="reviews"></review-list>
    <review-form @review-submitted="addReview"></review-form>
  </div>`,
   data() {
      return {
         product: 'Socks',
         brand: 'Vue Mastery',
         selectedVariant: 0,
         details: ['50% cotton', '30% wool', '20% polyester'],
         variants: [
            { id: 2234, color: 'green', image: './assets/images/socks_green.jpg', quantity: 50 },
            { id: 2235, color: 'blue', image: './assets/images/socks_blue.jpg', quantity: 0 },
         ],
         reviews: []
      }
   },
   methods: {
      addToCart() {
         this.$emit('add-to-cart', this.variants[this.selectedVariant].id)
      },
      updateVariant(index) {
         this.selectedVariant = index
      },
      addReview(review) {
         this.reviews.push(review)
      }
   },
   computed: {
      title() {
         return this.brand + ' ' + this.product
      },
      image() {
         return this.variants[this.selectedVariant].image
      },
      inStock() {
         return this.variants[this.selectedVariant].quantity
      },
      shipping() {
         if (this.premium) {
            return 'Free'
         }
         return 2.99
      }
   }
})




app.component('review-form', {
   template:
   /*html*/
   `<form class="review-form" @submit.prevent="onSubmit">
     <h3>Leave a review</h3>
     <label for="name">Name:</label>
     <input id="name" v-model="name">
  
     <label for="review">Review:</label>      
     <textarea id="review" v-model="review"></textarea>
  
     <label for="rating">Rating:</label>
     <select id="rating" v-model.number="rating">
       <option>5</option>
       <option>4</option>
       <option>3</option>
       <option>2</option>
       <option>1</option>
     </select>

     <label for="reccomendation">Reccomendation:</label>
     <select id="reccomendation" v-model="reccomendation">
           <option>Yes</option>
           <option>No</option>
     </select>
  
     <input class="button" type="submit" value="Submit">  
   </form>`,
   data() {
     return {
       name: '',
       review: '',
       rating: null,
       reccomendation: null
   }
 },
 methods: {
   onSubmit() {
       if (this.name === '' || this.review === '' || this.rating === null || this.reccomendation === null) {
           alert('Review is incomplete. Please fill out every field.')
           return
       }
     let productReview = {
       name: this.name,
       review: this.review,
       rating: this.rating,
       reccomendation: this.reccomendation
     }
     this.$emit('review-submitted', productReview)
 
     this.name = ''
     this.review = ''
     this.rating = null
     this.reccomendation = null
   }
 }
})



app.component('review-list', {
   props: {
     reviews: {
       type: Array,
       required: true
     }
   },
   template:
   /*html*/
   `
   <div class="review-container">
   <h3>Reviews:</h3>
     <ul>
       <li v-for="(review, index) in reviews" :key="index">
         {{ review.name }} gave this {{ review.rating }} stars
         <br/>
         "{{ review.review }}"
         <br/>
         They said {{ review.reccomendation }} to reccomending our products.
         <br>
       </li>
     </ul>
   </div>
 `
 })
 