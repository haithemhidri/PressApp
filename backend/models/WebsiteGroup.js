import mongoose from 'mongoose';

const websiteGroupSchema = mongoose.Schema(
{
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  websites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TargetWebsite',
    },
  ],
  websiteUrls: [String],
},
{
  timestamps: true,
}
);

const WebsiteGroup = mongoose.model('WebsiteGroup', websiteGroupSchema);

export default WebsiteGroup;
