import bcrypt from "bcryptjs";

import { Types } from "mongoose";

export const users = [

  {
    email: "john.doe@example.com",
    username: "johndoe",
    profilePic: "https://i.pinimg.com/originals/04/28/9e/04289ee064d70c9de8c5577aeb1a8433.jpg",
    password: bcrypt.hashSync("P._Dobariy@23", 10)
  },
  {
    email: "jane.smith@example.com",
    username: "janesmith",
    profilePic: "https://th.bing.com/th/id/OIP.7hDlEZVuo_I5orxYYnEaHQHaLH?rs=1&pid=ImgDetMain",
    password: bcrypt.hashSync("P._Dobariy@23", 10)
  },
  {
    email: "bob.johnson@example.com",
    username: "bobjohnson",
    profilePic: "https://images.pexels.com/photos/10898091/pexels-photo-10898091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    password: bcrypt.hashSync("P._Dobariy@23", 10)
  },

  {
    email: "emma.thompson@example.com",
    username: "Emma_Thompson",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "olivia.miller@example.com",
    username: "Olivia_Miller",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophia.davis@example.com",
    username: "Sophia_Davis",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava.wilson@example.com",
    username: "Ava_Wilson",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "isabella.brown@example.com",
    username: "Isabella_Brown",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "mia.johnson@example.com",
    username: "Mia_Johnson",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlotte.williams@example.com",
    username: "Charlotte_Williams",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "amelia.garcia@example.com",
    username: "Amelia_Garcia",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Male Users
  {
    email: "james.anderson@example.com",
    username: "James_Anderson",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "william.clark@example.com",
    username: "William_Clark",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "benjamin.taylor@example.com",
    username: "Benjamin_Taylor",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "lucas.moore@example.com",
    username: "Lucas_Moore",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "henry.jackson@example.com",
    username: "Henry_Jackson",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "alexander.martin@example.com",
    username: "Alexander_Martin",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "daniel.rodriguez@example.com",
    username: "Daniel_Rodriguez",
    password: bcrypt.hashSync("P._Dobariy@23", 10),
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
].map(user => ({ _id: new Types.ObjectId(), ...user }));