const router = require('express').Router();
const Product = require('./model');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'uploads' });

router.get('/product',async(req,res) => {
    
    let product = await Product.findAll({})
    res.status(200).send(product)
    
})

router.get('/product/:id',async(req,res) => {
    
    let id = req.params.id
    let product = await Product.findOne({ where: { id : id } })
    res.status(200).send(product)
    
})

router.post('/product',upload.single('image'), async (req,res) => {
    const {users_id, name, price, stock, status} = req.body;
    const image = req.file;
    if(image) {
        const target = path.join(__dirname,'../../uploads',image.originalname);
        fs.renameSync(image.path,target);
        try {
            await Product.sync();
            const result = await Product.create({users_id, name, price, stock, status,image_url: `http://localhost:3000/public/${image.originalname}`});
            res.send(result);
        }catch(e) {
            res.send(e);
        }
    }
});

router.put('/product/:id',upload.single('image'), async (req,res) => {
    const {users_id, name, price, stock, status} = req.body;
    const image = req.file;

    try {
        let ImageUrl = null;
        if(image) {
            const target = path.join(__dirname,'../../uploads',image.originalname);
            fs.renameSync(image.path,target);
            ImageUrl = `http://localhost:3000/public/${image.originalname}`;
        }

        const result = await Product.findByPk(req.params.id);

        if (!result) {
            return res.status(404).json({ error: "Product Not Found"});
        }

        result.users_id = parseInt(users_id);
        result.name = name;
        result.price = price;
        result.stock = stock;
        result.status = status;
        if (ImageUrl) {
            result.ImageUrl = ImageUrl;
        }

        await result.save();

        return res.json(result);
    } catch (error){
        console.log(error);
        return_response(res);
    }
});

router.delete('/product/:id',async(req,res) => {
    
    let id = req.params.id
    await Product.destroy({ where: { id : id } })
    res.status(200).send('Product is deleted')
    
})

module.exports = router;