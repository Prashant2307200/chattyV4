import { io } from '../config/socket.config.js';
import { getUserSocketId } from '../config/socket.config.js';

import { AppConfig } from '../config/app.config.js';
import { ExpressError } from '../utils/expressError.util.js';
import { catchAsyncError } from '../utils/catchAsyncError.util.js';

import { ChatService } from '../services/chat.service.js';
import { RequestService } from '../services/request.service.js';

const { Status } = AppConfig;

export const RequestController = {

  async getMyRequests(request, response, nextFunc) {
    const userId = request.user._id;

    const [error, requests] = await catchAsyncError(RequestService.getRequestsByUserId(userId));
    const [sentRequests, receivedRequests] = requests;

    if (error)
      return nextFunc(new ExpressError('Failed to fetch requests', 500));

    return response.status(Status.Created).json({
      sent: sentRequests,
      received: receivedRequests
    });
  },

  async sendRequest(request, response, nextFunc) {
    const { receiver } = request.body;
    const sender = request.user._id;

    if (sender.toString() === receiver) 
      return nextFunc(new ExpressError('You cannot send a request to yourself', 400));

    const [existingRequestError, existingRequest] = await catchAsyncError(RequestService.getRequestBySenderReceiver(sender, receiver));
    if (existingRequestError) 
      return nextFunc(new ExpressError('Failed to check existing requests', 500));
    if (existingRequest) 
      return nextFunc(new ExpressError('A pending request already exists between these users', 400));

    const [existingChatError, existingChat] = await catchAsyncError(ChatService.getChatBySenderReceiver(sender, receiver));

    if (existingChatError) 
      return nextFunc(new ExpressError('Failed to check existing chats', 500));
    if (existingChat) 
      return nextFunc(new ExpressError('A chat already exists between these users', 400));
    
    const [error, newRequest] = await catchAsyncError(RequestService.createRequest({ sender, receiver }));
    if (error) 
      return nextFunc(new ExpressError(`Failed to create request: ${error.message}`, 500));

    const [populateError, populatedRequest] = await catchAsyncError(RequestService.getRequestById(newRequest._id));

    if (populateError) 
      return nextFunc(new ExpressError('Failed to populate request data', 500));
      
    const receiverSocketId = getUserSocketId(receiver);
    if (receiverSocketId) 
      io.to(receiverSocketId).emit('newRequest', populatedRequest);

    return response.status(Status.Created).json(populatedRequest); 
  },
  
  async respondToRequest(request, response, nextFunc) {
    const { id } = request.params;
    const { status } = request.body;
    const userId = request.user._id;

    const [findError, chatRequest] = await catchAsyncError(RequestService.getRequestById(id));

    if (findError) 
      return nextFunc(new ExpressError('Failed to find request', 500));
    if (!chatRequest) 
      return nextFunc(new ExpressError('Request not found', 404));
    
    if (chatRequest.receiver._id.toString() !== userId.toString()) 
      return nextFunc(new ExpressError('You can only respond to requests sent to you', 403));
    if (chatRequest.status !== 'pending') 
      return nextFunc(new ExpressError(`This request has already been ${chatRequest.status}`, 400));

    chatRequest.status = status;
    const [saveError, updatedRequest] = await catchAsyncError(chatRequest.save()); 

    if (saveError) 
      return nextFunc(new ExpressError('Failed to update request status', 500));

    if (status === 'accepted') {
      const [chatError, newChat] = await catchAsyncError(ChatService.createChat({
        participants: [chatRequest.sender._id, chatRequest.receiver._id]
      }));

      if (chatError) 
        return nextFunc(new ExpressError('Failed to create chat', 500));

      const [populateError, populatedChat] = await catchAsyncError(ChatService.getChatById(newChat._id));

      if (populateError) 
        return nextFunc(new ExpressError('Failed to populate chat data', 500));
      
      const senderSocketId = getUserSocketId(chatRequest.sender._id);
      if (senderSocketId) {
        io.to(senderSocketId).emit('requestAccepted', {
          request: updatedRequest,
          chat: populatedChat
        });
      }

      return response.status(200).json({
        message: 'Request accepted and chat created',
        request: updatedRequest,
        chat: populatedChat
      });
    } else {

      const senderSocketId = getUserSocketId(chatRequest.sender._id);
      if (senderSocketId) 
        io.to(senderSocketId).emit('requestDeclined', updatedRequest);

      return response.status(200).json({
        message: 'Request declined',
        request: updatedRequest
      });
    } 
  },
  
  async cancelRequest(request, response, nextFunc) {
    const { id } = request.params;
    const userId = request.user._id;
 
    const [findError, chatRequest] = await catchAsyncError(RequestService.fetchRequest(id));

    if (findError) 
      return nextFunc(new ExpressError('Failed to find request', 500));
    if (!chatRequest) 
      return nextFunc(new ExpressError('Request not found', 404));
    
    if (chatRequest.sender.toString() !== userId.toString()) 
      return nextFunc(new ExpressError('You can only cancel requests you sent', 403));
    if (chatRequest.status !== 'pending') 
      return nextFunc(new ExpressError(`Cannot cancel a request that has been ${chatRequest.status}`, 400));

    const [deleteError] = await catchAsyncError(RequestService.cancelRequest(id));
    if (deleteError) 
      return nextFunc(new ExpressError('Failed to delete request', 500));
    
    const receiverSocketId = getUserSocketId(chatRequest.receiver);
    if (receiverSocketId) 
      io.to(receiverSocketId).emit('requestCancelled', chatRequest._id);

    return response.status(200).json({
      message: 'Request cancelled successfully'
    }); 
  }
}