const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  // We use a hardcoded ID so we always find the SAME profile
  _id: { type: String, default: "my-master-profile" }, 
  
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  website: { type: String, default: "" },
  
  // You can add more complex fields later like:
  // education: [{ school: String, degree: String }]
});

module.exports = mongoose.model('Profile', ProfileSchema);