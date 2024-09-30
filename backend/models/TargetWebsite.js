import mongoose from 'mongoose';

const targetWebsiteSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    language: {
      type: [String], 
      required: true,
    },
    category: {
      type: String, enum: ['Press', 'Media', 'Government', 'Other'],
      required: true
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

const TargetWebsite = mongoose.model('TargetWebsite', targetWebsiteSchema);

export default TargetWebsite;  
