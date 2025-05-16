export const catchAsyncError = p =>  p.then(data => [null, data]).catch(error => [error]) 
