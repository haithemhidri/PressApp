import SearchConfiguration from '../models/SearchConfiguration.js';
import TargetWebsite from '../models/TargetWebsite.js';
import WebsiteGroup from '../models/WebsiteGroup.js';

// Get all search configurations
export const getSearchConfigurations = async (req, res) => {
  try {
    const searchConfigurations = await SearchConfiguration.find()
      .populate('websites', 'url owner') // Populate websites with relevant fields
      .populate('group', 'name') // Populate group with relevant fields
      .exec();

    // Transform the data to include a 'target' field
    const transformedConfigurations = searchConfigurations.map(config => {
      const target = config.group
        ? { group: config.group.name }
        : { websites: config.websites.map(website => website.url) };

      return {
        ...config.toObject(),
        target
      };
    });

    res.json(transformedConfigurations);
  } catch (error) {
    console.error('Error fetching search configurations:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Create a new search configuration
export const createSearchConfiguration = async (req, res) => {
    const { searchTerm, websites, group, isScheduled, scheduleTime } = req.body;
  
    try {
      // Check if websites are provided
      if (!websites || !Array.isArray(websites)) {
        return res.status(400).json({ message: 'Websites must be an array' });
      }
  
      // Fetch the websites based on the provided IDs
      const fetchedWebsites = await TargetWebsite.find({ _id: { $in: websites } });
  
      // Initialize groupWebsiteUrls
      let groupWebsiteUrls = [];
      if (group) {
        const fetchedGroup = await WebsiteGroup.findById(group);
        if (!fetchedGroup) {
          return res.status(400).json({ message: 'Group not found' });
        }
        groupWebsiteUrls = fetchedGroup.websiteUrls || []; // Get URLs from the group
      }
  
      // Combine URLs from individual websites and the group
      const websiteUrls = [
        ...fetchedWebsites.map(website => website.url),
        ...groupWebsiteUrls,
      ];
  
      const newConfiguration = new SearchConfiguration({
        searchTerm,
        websites,
        group,
        isScheduled,
        scheduleTime,
        websiteUrls, // Populated with the combined URLs
      });
  
      const savedConfiguration = await newConfiguration.save();
      res.status(201).json(savedConfiguration);
    } catch (error) {
      console.error('Error creating search configuration:', error);
      res.status(400).json({ message: error.message });
    }
  };
        

// Update a search configuration
export const updateSearchConfiguration = async (req, res) => {
    const { id } = req.params;
    const { searchTerm, websites, group, isScheduled, scheduleTime } = req.body;
  
    try {
      // Fetch the websites based on the provided IDs
      const fetchedWebsites = await TargetWebsite.find({ _id: { $in: websites } });
  
      // Initialize groupWebsiteUrls
      let groupWebsiteUrls = [];
      if (group) {
        const fetchedGroup = await WebsiteGroup.findById(group);
        if (!fetchedGroup) {
          return res.status(400).json({ message: 'Group not found' });
        }
        groupWebsiteUrls = fetchedGroup.websiteUrls || []; // Get URLs from the group
      }
  
      // Combine URLs from individual websites and the group
      const websiteUrls = [
        ...fetchedWebsites.map(website => website.url),
        ...groupWebsiteUrls,
      ];
  
      const updatedConfiguration = await SearchConfiguration.findByIdAndUpdate(
        id,
        { searchTerm, websites, group, isScheduled, scheduleTime, websiteUrls }, // Include websiteUrls
        { new: true }
      ).populate('websites')
        .populate('group');
  
      if (!updatedConfiguration) return res.status(404).json({ message: 'Configuration not found' });
      res.json(updatedConfiguration);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
// Delete a search configuration
export const deleteSearchConfiguration = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedConfiguration = await SearchConfiguration.findByIdAndDelete(id);
    if (!deletedConfiguration) return res.status(404).json({ message: 'Configuration not found' });
    res.json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
