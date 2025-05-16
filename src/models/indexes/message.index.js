import Message from '../message.model.js';

async function createMessageIndexes() {
  
  await Message.collection.createIndex({ chat: 1 });
  
  // await Message.collection.createIndex({ sender: 1, createdAt: -1 });
  
  // await Message.collection.createIndex({ 
  //   chat: 1, 
  //   sender: 1, 
  //   createdAt: 1 
  // });
  
  // await Message.collection.createIndex({ text: 'text' }); 
}

export default createMessageIndexes;
