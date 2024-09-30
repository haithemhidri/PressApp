import mongoose from 'mongoose';

const searchConfigurationSchema = mongoose.Schema(
  {
    searchTerm: {
      type: String,
      required: true,
    },
    websites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TargetWebsite',
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WebsiteGroup',
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
    scheduleTime: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    websiteUrls: { 
        type: [String],
        default: [],
      },
  },
  {
    timestamps: true,
  }
);

const SearchConfiguration = mongoose.model('SearchConfiguration', searchConfigurationSchema);

export default SearchConfiguration;
