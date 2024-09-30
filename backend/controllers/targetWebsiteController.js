import asyncHandler from 'express-async-handler';
import TargetWebsite from '../models/TargetWebsite.js';

// @desc    Get all target websites
// @route   GET /api/target-websites
// @access  Private
export const getTargetWebsites = asyncHandler(async (req, res) => {
  const websites = await TargetWebsite.find({});
  res.json(websites);
});

// @desc    Create a new target website
// @route   POST /api/target-websites
// @access  Private
export const createTargetWebsite = asyncHandler(async (req, res) => {
  const { url, owner, country, language, category  } = req.body;

  const websiteExists = await TargetWebsite.findOne({ url });

  if (websiteExists) {
    res.status(400);
    throw new Error('Website already exists');
  }

  const website = new TargetWebsite({
    url,
    owner,
    country,
    language,
    category,
  });

  const createdWebsite = await website.save();
  res.status(201).json(createdWebsite);
});

// @desc    Update a target website
// @route   PUT /api/target-websites/:id
// @access  Private
export const updateTargetWebsite = asyncHandler(async (req, res) => {
  const { url, owner, country, language, category } = req.body;

  const website = await TargetWebsite.findById(req.params.id);

  if (website) {
    website.url = url || website.url;
    website.owner = owner || website.owner;
    website.country = country || website.country;
    website.language = language || website.language;
    website.category = category || website.category;

    const updatedWebsite = await website.save();
    res.json(updatedWebsite);
  } else {
    res.status(404);
    throw new Error('Website not found');
  }
});

// @desc    Delete a target website
// @route   DELETE /api/target-websites/:id
// @access  Private
export const deleteTargetWebsite = asyncHandler(async (req, res) => {
  const website = await TargetWebsite.findById(req.params.id);

  if (website) {
    await TargetWebsite.deleteOne({ _id: req.params.id });
    res.json({ message: 'Website removed' });
  } else {
    res.status(404);
    throw new Error('Website not found');
  }
});
