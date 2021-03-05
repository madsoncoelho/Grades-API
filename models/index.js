import mongoose from 'mongoose';

const db = {};
db.schema = {
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  lastModified: {
    type: Date,
    default: Date.now(),
  },
};
db.mongoose = mongoose;
db.url = process.env.MONGODB;
db.model = db.mongoose.model('student', db.schema);

export { db };
