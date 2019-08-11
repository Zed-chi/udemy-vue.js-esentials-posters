const loadNum = 4;
let watchDog;
const vue = new Vue({
    el: "#app",
    data:{
       total:0,
       products:[
           
       ],
       cart:[],
       search:"dog",
       lastSearch:"",
       loading:false,
       results:[],
    },
    methods:{
        addToCard: function(product){
            //console.log(product);
            this.total += product.price;
            let found = false;
            for(let i=0; i<this.cart.length; i++){
                if(this.cart[i].id === product.id){
                    this.cart[i].qty+=1;
                    found = true;
                }
            }
            if (!found){
                this.cart.push({
                    id:product.id,
                    title:product.title,
                    price:product.price,
                    qty:1
                });
            }
        },
        inc: function(item){
            item.qty++;
            this.total+=item.price
        },
        dec: function(item){
            item.qty--;
            this.total-=item.price
            if (item.qty <= 0){
                const i = this.cart.indexOf(item);
                this.cart.pop(i)
            }
        },
        onSubmit:function(){
            this.products = [];
            this.results = [];
            this.loading = true;
            const path = "./search?q=".concat(this.search);
            this.$http.get(path).then(function(res){
                setTimeout(function(){
                    this.results = res.body;
                    this.lastSearch = this.search;
                    this.appendResults();
                    this.loading = false;
                }.bind(this), 1000);
                
            });
        },
        appendResults:function(){
            if(this.products.length < this.results.length){
                let toAppend = this.results.slice(
                    this.products.length, 
                    loadNum+this.products.length
                );
                this.products = this.products.concat(toAppend);
            }
        },
    },
    filters:{
        currency:function(price){
            return price.toFixed(2);
        },
    },
    created:function(){
        this.onSubmit();
    },
    updated:function(){
        const sensor = document.querySelector("#product-list-bottom");
        watchDog = scrollMonitor.create(sensor);
        watchDog.enterViewport(this.appendResults);        
    },
    beforeUpdate:function(){
        if(watchDog){
            watchDog.destroy();
            watchDog = null;
        }
        
    },
});