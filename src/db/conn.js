const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://booksbay:somethingcreative@cluster0.fnsps.mongodb.net/booksbay?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=> {
    console.log(`Connection Successful`);
}).catch(()=>{
    console.log(`No connection`);
})