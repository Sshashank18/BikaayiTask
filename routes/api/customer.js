const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Customer = mongoose.model("Customer");
const PurchaseOrder = mongoose.model("PurchaseOrder");
const Shipping = mongoose.model("Shipping");

router.post('/addCustomer', (req,res) => {
    console.log(req.body);
    const {customerName, email, mobile, city} = req.body;
    
    Customer.findOne({email: email})
    .then((savedCustomer)=>{
        if(savedCustomer){
            return res.status(422).json({error: "Email Already Exists"});
        }
        const customer = new Customer({
            customerName,
            email,
            mobile,
            city
        });
        customer.save();
        return res.status(200).json({message: "Customer Created"});
    });
});

router.post('/addPurchaseOrder', (req,res) => {
    const {productName, quantity, pricing, mrp} = req.body;

    if(pricing > mrp){
        return res.status(422).json({error: "Pricing cannot exceed MRP."});
    }

    const purchaseOrder = new PurchaseOrder({
        productName,
        quantity,
        pricing,
        mrp,
        customerID:req.body.customerID
    });
    purchaseOrder.save();
    return res.status(200).json({message: "Purchase Order Details Added"});
});

router.post('/addShipping', (req,res) => {
    const {address, city, pincode} = req.body;

    const shipping = new Shipping({
        address,
        city,
        pincode,
        purchaseOrderID: req.body.purchaseOrderID,
        customerID: req.body.customerID
    });
    shipping.save();
    return res.status(200).json({message: "Shipping Details Added"});
});


router.get('/getCustomers',(req,res)=>{
    Shipping.find({city: req.query.city})
    .populate({
        path: 'customerID',
    })
    .exec((err,shipping)=>{
        if(err){
            return res.status(422).json({error: "Could not Find Customers."});
        }
        else{
            const details = new Array();
            shipping.forEach(element => {
                var det = {
                    customerName: element.customerID.customerName,
                    email: element.customerID.email,
                    customerCity: element.customerID.city,
                    shippingAddress: element.address,
                    shippingCity: element.city,
                    shippingPincode: element.pincode
                }
                details.push(det);
            });
            return res.status(200).json(details);
        }
    });
});

router.get('/getPurchaseOrder',(req,res)=>{

    Customer.find({})
    .then(customers =>{
        const details = new Array();
        customers.forEach(customer => {
            var purchaseOrder = new Array();
            PurchaseOrder.find({customerID : customer._id})
            .then(orders=>{
                if(!orders.length){
                    var det = {
                        customerId: customer._id,
                        customerName: customer.customerName,
                        customerEmail: customer.email,
                        customerMobile: customer.mobile,
                        customerCity: customer.city,
                        purchaseOrder
                    }
                    details.push(det);   
                }
                else{
                    orders.forEach(order => {
                        var orderObj = {
                            purchaseOrderID: order._id,
                            productName: order.productName,
                            quantity: order.quantity,
                            price: order.pricing,
                            mrp: order.mrp,
                        }
                        purchaseOrder.push(orderObj);
                    });
                    var det = {
                        customerId: customer._id,
                        customerName: customer.customerName,
                        customerEmail: customer.email,
                        customerMobile: customer.mobile,
                        customerCity: customer.city,
                        purchaseOrder
                    }
                    details.push(det);
                }
            });
        });
        setTimeout(() => {return res.status(200).json(details)},1000);
    });
});

router.get('/getPurchaseShipmentOrder',(req,res)=>{

    Customer.find({})
    .then(customers =>{
        const details = new Array();
        customers.forEach(customer => {
            var purchaseOrder = new Array();
            var shipping = new Array();
            PurchaseOrder.find({customerID : customer._id})
            .then(orders=>{
                if(!orders.length){
                    var det = {
                        customerId: customer._id,
                        customerName: customer.customerName,
                        customerEmail: customer.email,
                        customerMobile: customer.mobile,
                        customerCity: customer.city,
                        purchaseOrder
                    }
                    details.push(det);   
                }
                else{
                    orders.forEach(order => {
                        var orderObj = {
                            purchaseOrderID: order._id,
                            productName: order.productName,
                            quantity: order.quantity,
                            price: order.pricing,
                            mrp: order.mrp,
                        }
                        Shipping.find({purchaseOrderID: order._id, customerID: customer._id})
                        .then(shipments => {
                            if(!shipments.length){
                                var det = {
                                    customerId: customer._id,
                                    customerName: customer.customerName,
                                    customerEmail: customer.email,
                                    customerMobile: customer.mobile,
                                    customerCity: customer.city,
                                    purchaseOrder
                                }
                                details.push(det);
                            }else{
                                shipments.forEach(shipment => {
                                    var shipObj={
                                        address: shipment.address,
                                        city: shipment.city,
                                        pincode: shipment.pincode
                                    }
                                    shipping.push(shipObj);
                                });
                                orderObj.shipmentDetail = shipping;
                                purchaseOrder.push(orderObj);
                                var det = {
                                    customerId: customer._id,
                                    customerName: customer.customerName,
                                    customerEmail: customer.email,
                                    customerMobile: customer.mobile,
                                    customerCity: customer.city,
                                    purchaseOrder
                                }
                                details.push(det);
                            }
                        });
                    });
                }
            });
        });
        setTimeout(() => {return res.status(200).json(details)},1000);
    });
});
       


module.exports = router;