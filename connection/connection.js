const mongoose=require('mongoose')


let connect = mongoose.connect('mongodb+srv://sponsorbondcom:RxHNefiQuT7LJPQO@cluster0.7ace9.mongodb.net/<yourDatabaseName>');
// let connect = mongoose.connect('mongodb://127.0.0.1/influencer');

module.exports=connect;
