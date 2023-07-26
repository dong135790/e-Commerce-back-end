const router = require('express').Router();
const { where } = require('sequelize');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // find all tags
    const tagData = await Tag.findAll();
    // be sure to include its associated Product data
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id);
    if (!tagData) {
      res.status(404).json({ message: 'No user found with this id!'});
      return
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  // create a new tag
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  const updatedTag = await Tag.update(
    {
      tag_name: req.params.tag_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
  res.json(updatedTag)
});

// router.delete('/:id', async (req, res) => {
//   // delete on tag by its `id` value
//   const deletedTag = await Tag.destroy({
//     where: {
//       id: req.params.id,
//     },
//   });
//   res.json(deletedTag)
// });

module.exports = router;
