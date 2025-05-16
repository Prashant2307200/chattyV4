import Request from '../request.model.js';

async function createRequestIndexes() {
  
  await Request.collection.createIndex({ sender: 1, createdAt: -1 });
  
  await Request.collection.createIndex({ receiver: 1, createdAt: -1 });

  await Request.collection.createIndex({
    sender: 1,
    receiver: 1,
    status: 1
  });

  await Request.collection.createIndex({ 
    receiver: 1, 
    sender: 1, 
    status: 1 
  });
  
  await Request.collection.createIndex({ status: 1 }); 
}

export default createRequestIndexes;
