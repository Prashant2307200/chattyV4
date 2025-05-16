import { Types } from "mongoose";
import { users } from "./user.seeder.js";

const johndoe = users.find(user => user.username === "johndoe");
const janesmith = users.find(user => user.username === "janesmith");
const bobjohnson = users.find(user => user.username === "bobjohnson");
const emma = users.find(user => user.username === "Emma_Thompson");
const olivia = users.find(user => user.username === "Olivia_Miller");
const sophia = users.find(user => user.username === "Sophia_Davis");
 
const now = new Date();
const oneHourAgo = new Date(now - 1 * 60 * 60 * 1000);
const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000);
const sixHoursAgo = new Date(now - 6 * 60 * 60 * 1000);
const yesterday = new Date(now - 24 * 60 * 60 * 1000);
const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);

export const requests = [ 
  {
    _id: new Types.ObjectId(),
    sender: johndoe._id,
    receiver: emma._id,
    status: "pending",
    createdAt: oneHourAgo,
    updatedAt: oneHourAgo
  },
  {
    _id: new Types.ObjectId(),
    sender: johndoe._id,
    receiver: olivia._id,
    status: "pending",
    createdAt: sixHoursAgo,
    updatedAt: sixHoursAgo
  },
 
  {
    _id: new Types.ObjectId(),
    sender: sophia._id,
    receiver: johndoe._id,
    status: "pending",
    createdAt: twoHoursAgo,
    updatedAt: twoHoursAgo
  },
 
  {
    _id: new Types.ObjectId(),
    sender: johndoe._id,
    receiver: sophia._id,
    status: "declined",
    createdAt: threeDaysAgo,
    updatedAt: yesterday
  },
 
  {
    _id: new Types.ObjectId(),
    sender: emma._id,
    receiver: johndoe._id,
    status: "declined",
    createdAt: threeDaysAgo,
    updatedAt: yesterday
  },
  {
    _id: new Types.ObjectId(),
    sender: janesmith._id,
    receiver: johndoe._id,
    status: "accepted",
    createdAt: threeDaysAgo,
    updatedAt: yesterday
  },
  {
    _id: new Types.ObjectId(),
    sender: johndoe._id,
    receiver: bobjohnson._id,
    status: "accepted",
    createdAt: threeDaysAgo,
    updatedAt: yesterday
  },
];
