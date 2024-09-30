import asyncHandler from 'express-async-handler';
import WebsiteGroup from '../models/WebsiteGroup.js';
import TargetWebsite from '../models/TargetWebsite.js';

// @desc    Get all website groups
// @route   GET /api/website-groups
// @access  Private
export const getWebsiteGroups = asyncHandler(async (req, res) => {
  try {
    // Populate the `websites` field with website data including the `url` field
    const websiteGroups = await WebsiteGroup.find().populate({
      path: 'websites', // Path to the referenced `websites`
      model: 'TargetWebsite',
      select: 'url',    // Only select the `url` field of websites
    });
    
    res.json(websiteGroups);
  } catch (error) {
    console.error('Error fetching website groups:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a new website group
// @route   POST /api/website-groups
// @access  Private
export const createWebsiteGroup = asyncHandler(async (req, res) => {
  const { name, description, websites } = req.body;

  // Fetch the website URLs based on the provided website IDs
  const fetchedWebsites = await TargetWebsite.find({ _id: { $in: websites } });
  const websiteUrls = fetchedWebsites.map(website => website.url);

  const newGroup = new WebsiteGroup({
    name,
    description,
    websites,
    websiteUrls, // Include websiteUrls here
  });

  const createdGroup = await newGroup.save();
  res.status(201).json(createdGroup);
});

// @desc    Update a website group
// @route   PUT /api/website-groups/:id
// @access  Private
export const updateWebsiteGroup = asyncHandler(async (req, res) => {
  const { name, description, websites } = req.body;

  const group = await WebsiteGroup.findById(req.params.id);

  if (group) {
    group.name = name || group.name;
    group.description = description || group.description;
    group.websites = websites || group.websites;

    // Fetch the website URLs based on the provided website IDs
    const fetchedWebsites = await TargetWebsite.find({ _id: { $in: websites } });
    group.websiteUrls = fetchedWebsites.map(website => website.url); // Update websiteUrls

    const updatedGroup = await group.save();
    res.json(updatedGroup);
  } else {
    res.status(404);
    throw new Error('Website group not found');
  }
});

// @desc    Delete a website group
// @route   DELETE /api/website-groups/:id
// @access  Private
export const deleteWebsiteGroup = asyncHandler(async (req, res) => {
  const group = await WebsiteGroup.findById(req.params.id);

  if (group) {
    await WebsiteGroup.deleteOne({ _id: req.params.id });
    res.json({ message: 'Website group removed' });
  } else {
    res.status(404);
    throw new Error('Website group not found');
  }
});


