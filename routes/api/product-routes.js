const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  try {
    // find all tags
    // Include: Tag needs the association in index.js
    const productData = await Product.findAll({ include: Tag});
    // be sure to include its associated Product data
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err)
  }
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    const ProductData = await Product.findByPk(req.params.id);
    if (!ProductData) {
      res.status(404).json({ message: 'No user found with this id!'});
      return
    }
    res.status(200).json(ProductData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
// update product
router.put('/:id', async (req, res) => {
  try {
    // await based on id found
    const product = await Product.findByPk(req.params.id);
    // if no product found based on id, error 404
    if (!product) {
      return res.status(404).json('product not found.');
    }
    await product.update(req.body);
    await product.save();
    if (req.body.tagIds) {
      await product.setTags(req.body.tagIds);
    }
    res.json(await product.getTags());
  } catch(err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;
