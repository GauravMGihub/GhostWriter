require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Profile = require('./models/Profile');

const app = express();  

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ DB Error:', err));

//API routes

app.get('/api/profile', async (req, res) => {
  try {
        let profile = await Profile.findById("my-master-profile");
      
      if(!profile) {
          profile = new Profile({ _id: "my-master-profile" });
          await profile.save();
      }
      
      res.json(profile);
      
    } catch (err) {
        console.error('❌ Fetch Profile Error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

//PUT route to save the data which we receieved above

app.put('/api/profile', async (req, res) => {
    try {
        const updatedProfile = await Profile.findByIdAndUpdate(
            "my-master-profile", // ID of the profile to update (we only have one profile)
            req.body, // data to update
            { new: true, upsert: true } // return updated profile and create if not exists
        );
        res.json(updatedProfile);
    } catch (err) {
        console.error('❌ Update Profile Error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
