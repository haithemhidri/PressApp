import mongoose from 'mongoose';

const searchResultSchema = new mongoose.Schema({
  launchDateTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  searchTerm: {
    type: String,
    required: true,
  },
  target: {
    websites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TargetWebsite' }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WebsiteGroup' }],
  },
  results: [{
    websiteUrl: { type: String, required: true },
    firstResultLink: { type: String, required: true },
  }],
});

const SearchResult = mongoose.model('SearchResult', searchResultSchema);

export default SearchResult;
