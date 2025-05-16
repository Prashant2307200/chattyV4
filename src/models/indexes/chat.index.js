import Chat from '../chat.model.js';

async function createChatIndexes() {
  
  await Chat.collection.createIndex({ participants: 1, updatedAt: -1 });
  
  // await Chat.collection.createIndex({ isGroupChat: 1 });
  
  // await Chat.collection.createIndex({ groupAdmin: 1 });
  
  // await Chat.collection.createIndex({ name: 'text' });
  
  await Chat.collection.createIndex({ 
    isGroupChat: 1, 
    participants: 1 
  }); 
}

export default createChatIndexes;
