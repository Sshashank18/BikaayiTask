const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const {ObjectId} = Schema.Types

const customerSchema = new Schema({
    customerName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    mobile:{
        type:Number,
        required: true
    },
    city:{
        type:String,
        required: true
    }
});

const purchaseOrderSchema = new Schema({
    productName:{
        type:String,
        required: true
    },
    quantity:{
        type:Number,
        required: true
    },
    pricing:{
        type:Number,
        required: true
    },
    mrp:{
        type:Number,
        required: true
    },
    customerID: { type: Schema.Types.ObjectId, ref: 'Customer' }
});

const shippingSchema = new Schema({
    address:{
        type:String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    pincode:{
        type:Number,
        required: true
    },
    purchaseOrderID: { type: Schema.Types.ObjectId, ref: 'PurcaseOrder' },
    customerID: { type: Schema.Types.ObjectId, ref: 'Customer' }
})

mongoose.model("Customer", customerSchema);
mongoose.model("PurchaseOrder", purchaseOrderSchema);
mongoose.model("Shipping", shippingSchema);