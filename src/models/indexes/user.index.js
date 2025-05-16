import User from '../user.model.js';

async function createUserIndexes() { 

  await User.collection.createIndex({ email: 1, unique: 1 });
  
  await User.collection.createIndex({
    username: 'text',
    email: 'text'
  }, {
    weights: {
      username: 2,
      email: 1
    }
  });
}

export default createUserIndexes;
