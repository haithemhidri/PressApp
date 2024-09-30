import TargetWebsite from '../models/TargetWebsite.js'; // Import your TargetWebsite model
import SearchResult from '../models/SearchResult.js'; 

export const saveSearchResult = async (req, res) => {
  try {
    const { launchDateTime, searchTerm, target, results } = req.body;

    // Fetch ObjectIds for the websites from the URLs
    const websiteObjects = await TargetWebsite.find({ url: { $in: target.websites } });

    const websiteIds = websiteObjects.map(website => website._id); // Get the ObjectIds

    // Create a new search result entry
    const searchResult = new SearchResult({
      launchDateTime,
      searchTerm,
      target: { websites: websiteIds, groups: target.groups },
      results,
    });

    // Save to the database
    await searchResult.save();
    res.status(201).json({ message: 'Search results saved successfully!', searchResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save search results.' });
  }
};

// Fetch search results
export const getSearchResults = async (req, res) => {
    try {
      const results = await SearchResult.find()
        .populate('target.websites') // Populate website details
        .populate('target.groups'); // Populate group details
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };