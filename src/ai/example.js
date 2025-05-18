export default function examples(userId) {
  return {
    "User ID": [
      {
        "type": "user",
        "user": "What's my user ID?"
      },
      {
        "type": "output",
        "output": `Your user ID is ${userId}.`.toString()
      }
    ],

    "Show chats": [
      {
        "type": "user",
        "user": "Hey, can you give me my chats"
      },
      {
        "type": "plan",
        "plan": `I will call the getChatUsers for current user id ${userId}`.toString()
      },
      {
        "type": "action",
        "function": "getChatUsers",
        "input": [`${userId}`]
      },
      {
        "type": "observation",
        "observation": [
          {
            "_id": "chat1",
            "participants": [
              {
                "_id": "user2",
                "username": "alice",
                "profilePic": "alice.jpg"
              },
            ],
            "name": "Alice Chat",
            "isGroupChat": false,
            "groupAdmin": null,
            "createdAt": "2024-04-01T10:00:00.000Z",
            "updatedAt": "2024-04-24T15:00:00.000Z"
          },
          {
            "_id": "chat2",
            "participants": [
              {
                "_id": "user3",
                "username": "bob",
                "profilePic": "bob.png"
              }, {
                "_id": "user4",
                "username": "carol",
                "profilePic": "carol.png"
              }
            ],
            "name": "Project Group",
            "isGroupChat": true,
            "groupAdmin": "user1",
            "createdAt": "2024-03-10T08:30:00.000Z",
            "updatedAt": "2024-04-22T12:45:00.000Z"
          }
        ]
      },
      {
        "type": "output",
        "output": "Here are your chats. One with alice and a group chat named 'Project Group' with bob and carol."
      }
    ],

    "Show chat messages": [
      {
        "type": "user",
        "user": "Hey, can you give me my chats with janesmith"
      },
      {
        "type": "plan",
        "plan": `I will call the getChatUsers for current user id ${userId} and then getChatMessages for the chat with janesmith`.toString()
      },
      {
        "type": "action",
        "function": "getChatUsers",
        "input": [`${userId}`.toString()]
      },
      {
        "type": "observation",
        "observation": [
          {
            "_id": "chat1",
            "participants": [
              {
                "_id": "user2",
                "username": "janesmith",
                "profilePic": "janesmith.jpg"
              }
            ],
            "name": "Jane Chat",
            "isGroupChat": false,
            "groupAdmin": null,
            "createdAt": "2024-04-01T10:00:00.000Z",
            "updatedAt": "2024-04-24T15:00:00.000Z"
          }
        ]
      },
      {
        "type": "action",
        "function": "getChatMessages",
        "input": ["chat1"]
      },
      {
        "type": "observation",
        "observation": [
          {
            "_id": "message1",
            "sender": {
              "_id": "user2",
              "username": "janesmith",
              "profilePic": "janesmith.jpg"
            },
            "text": "Hello, how are you?",
            "createdAt": "2024-04-24T15:00:00.000Z",
            "updatedAt": "2024-04-24T15:00:00.000Z"
          },
          {
            "_id": "message2",
            "sender": {
              "_id": "user1",
              "username": "john",
              "profilePic": "john.jpg"
            },
            "text": "I'm good, thanks! How about you?",
            "createdAt": "2024-04-24T15:01:00.000Z",
            "updatedAt": "2024-04-24T15:01:00.000Z"
          }
        ]
      },
      {
        "type": "output",
        "output": "Here are the messages in your chat with janesmith. She said \"Hello, how are you?\" and you responded \"I\'m good, thanks! How about you?\""
      }
    ],

    "Send chat message": [
      {
        "type": "user",
        "user": "Hey, can you send a message to janesmith saying 'Hi, how are you?'"
      },
      {
        "type": "plan",
        "plan": `I will call the getChatUsers for current user id ${userId} and then createMessage for the chat with janesmith`.toString()
      },
      {
        "type": "action",
        "function": "getChatUsers",
        "input": [`${userId}`]
      },
      {
        "type": "observation",
        "observation": [
          {
            "_id": "chat1",
            "participants": [
              {
                "_id": "user2",
                "username": "janesmith",
                "profilePic": "janesmith.jpg"
              }
            ],
            "name": "Jane Chat",
            "isGroupChat": false,
            "groupAdmin": null,
            "createdAt": "2024-04-01T10:00:00.000Z",
            "updatedAt": "2024-04-24T15:00:00.000Z"
          }
        ]
      },
      {
        "type": "action",
        "function": "createMessage",
        "input": [
          {
            "chat": "chat1",
            "text": "Hi, how are you?",
            "sender": `${userId}`.toString()
          }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "message3",
          "sender": {
            "_id": "user1",
            "username": "john",
            "profilePic": "john.jpg"
          },
          "text": "Hi, how are you?",
          "createdAt": "2024-04-24T15:02:00.000Z",
          "updatedAt": "2024-04-24T15:02:00.000Z"
        }
      },
      {
        "type": "output",
        "output": "Message sent to janesmith: 'Hi, how are you?'"
      }
    ],

    "Search for users": [
      {
        "type": "user",
        "user": "Find users with 'smith' in their name"
      },
      {
        "type": "plan",
        "plan": "I will use searchAllUsers to find users with 'smith' in their username or email"
      },
      {
        "type": "action",
        "function": "searchAllUsers",
        "input": [
          `${userId}`.toString(),
          "smith"
        ]
      },
      {
        "type": "observation",
        "observation": [
          {
            "_id": "user2",
            "username": "janesmith",
            "email": "jane.smith@example.com",
            "profilePic": "janesmith.jpg"
          },
          {
            "_id": "user5",
            "username": "smithjohn",
            "email": "john.smith@example.com",
            "profilePic": "smithjohn.jpg"
          }
        ]
      },
      {
        "type": "output",
        "output": "I found 2 users matching 'smith': janesmith (jane.smith@example.com) and smithjohn (john.smith@example.com)."
      }
    ],

    "Check friend requests": [
      {
        "type": "user",
        "user": "Do I have any pending friend requests?"
      },
      {
        "type": "plan",
        "plan": "I will use getRequestsByUserId to check for pending friend requests"
      },
      {
        "type": "action",
        "function": "getRequestsByUserId",
        "input": [
          `${userId}`
        ]
      },
      {
        "type": "observation",
        "observation": [
          [
            {
              "_id": "req1",
              "sender": {
                "_id": `${userId}`.toString(),
                "username": "john"
              },
              "receiver": {
                "_id": "user6",
                "username": "david"
              },
              "status": "pending",
              "createdAt": "2024-04-20T14:30:00.000Z"
            }
          ],
          [
            {
              "_id": "req2",
              "sender": {
                "_id": "user7",
                "username": "emma"
              },
              "receiver": {
                "_id": `${userId}`.toString(),
                "username": "john"
              },
              "status": "pending",
              "createdAt": "2024-04-22T09:15:00.000Z"
            }
          ]
        ]
      },
      {
        "type": "output",
        "output": "Yes, you have 1 pending friend request from emma (sent on April 22). You have also sent 1 pending request to david (on April 20)."
      }
    ],

    "Create a new group chat": [
      {
        "type": "user",
        "user": "Create a group chat called 'Project Team' with bob and emma"
      },
      {
        "type": "plan",
        "plan": "I need to find bob and emma's user IDs, then create a group chat with them and the current user"
      },
      {
        "type": "action",
        "function": "getUser",
        "input": [
          {
            "username": "bob"
          }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "user3",
          "username": "bob",
          "email": "bob@example.com",
          "profilePic": "bob.png"
        }
      },
      {
        "type": "action",
        "function": "getUser",
        "input": [
          {
            "username": "emma"
          }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "user7",
          "username": "emma",
          "email": "emma@example.com",
          "profilePic": "emma.jpg"
        }
      },
      {
        "type": "action",
        "function": "createChat",
        "input": [
          {
            "name": "Project Team",
            "isGroupChat": true,
            "participants": [
              `${userId}`,
              "user3",
              "user7"
            ],
            "groupAdmin": `${userId}`.toString()
          }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "chat3",
          "name": "Project Team",
          "isGroupChat": true,
          "participants": [
            {
              "_id": `${userId}`.toString(),
              "username": "john"
            },
            {
              "_id": "user3",
              "username": "bob"
            },
            {
              "_id": "user7",
              "username": "emma"
            }
          ],
          "groupAdmin": `${userId}`.toString(),
          "createdAt": "2024-04-25T10:00:00.000Z"
        }
      },
      {
        "type": "output",
        "output": "I've created a new group chat called 'Project Team' with you, bob, and emma. You are the group admin."
      }
    ],

    "Send a friend request (existing request)": [
      {
        "type": "user",
        "user": "Send a friend request to david"
      },
      {
        "type": "plan",
        "plan": "I need to find david's user ID, check if there's already a request or chat, then create a request if needed"
      },
      {
        "type": "action",
        "function": "getUser",
        "input": [
          {
            "username": "david"
          }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "user6",
          "username": "david",
          "email": "david@example.com",
          "profilePic": "david.jpg"
        }
      },
      {
        "type": "action",
        "function": "getRequestBySenderReceiver",
        "input": [
          `${userId}`,
          "user6"
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "req1",
          "sender": {
            "_id": `${userId}`.toString()
          },
          "receiver": {
            "_id": "user6"
          },
          "status": "pending"
        }
      },
      {
        "type": "output",
        "output": "You already have a pending friend request to david. No need to send another one."
      }
    ],

    "Send a friend request (complete flow)": [
      {
        "type": "user",
        "user": "Send a friend request to michael"
      },
      {
        "type": "plan",
        "plan": "I need to find michael's user ID, check if there's already a request or chat, then create a request if needed"
      },
      {
        "type": "action",
        "function": "getUser",
        "input": [
          {
            "username": "michael"
          }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "user8",
          "username": "michael",
          "email": "michael@example.com",
          "profilePic": "michael.jpg"
        }
      },
      {
        "type": "action",
        "function": "getRequestBySenderReceiver",
        "input": [
          `${userId}`,
          "user8"
        ]
      },
      {
        "type": "observation",
        "observation": null
      },
      {
        "type": "action",
        "function": "getChatBySenderReceiver",
        "input": [
          `${userId}`,
          "user8"
        ]
      },
      {
        "type": "observation",
        "observation": null
      },
      {
        "type": "action",
        "function": "createRequest",
        "input": [
          {
            "sender": `${userId}`.toString(),
            "receiver": "user8"
          }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "req3",
          "sender": {
            "_id": `${userId}`.toString(),
            "username": "john"
          },
          "receiver": {
            "_id": "user8",
            "username": "michael"
          },
          "status": "pending",
          "createdAt": "2024-04-25T14:30:00.000Z"
        }
      },
      {
        "type": "output",
        "output": "Friend request sent to michael successfully."
      }
    ],

    "Send a friend request (users already in chat)": [
      {
        "type": "user",
        "user": "Send a friend request to bob"
      },
      {
        "type": "plan",
        "plan": "I need to find bob's user ID, check if there's already a request or chat, then create a request if needed"
      },
      {
        "type": "action",
        "function": "getUser",
        "input": [
          {
            "username": "bob"
          }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "user3",
          "username": "bob",
          "email": "bob@example.com",
          "profilePic": "bob.png"
        }
      },
      {
        "type": "action",
        "function": "getRequestBySenderReceiver",
        "input": [
          `${userId}`,
          "user3"
        ]
      },
      {
        "type": "observation",
        "observation": null
      },
      {
        "type": "action",
        "function": "getChatBySenderReceiver",
        "input": [
          `${userId}`,
          "user3"
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "chat5",
          "isGroupChat": false,
          "participants": [
            {
              "_id": `${userId}`.toString(),
              "username": "john"
            },
            {
              "_id": "user3",
              "username": "bob"
            }
          ]
        }
      },
      {
        "type": "output",
        "output": "You already have a chat with bob, so you don't need to send a friend request."
      }
    ],

    "Find and get messages from a specific chat": [
      {
        "type": "user",
        "user": "Show me messages from the Project Team group chat"
      },
      {
        "type": "plan",
        "plan": "I need to find the Project Team group chat and then get its messages"
      },
      {
        "type": "action",
        "function": "getChatUsers",
        "input": [
          `${userId}`
        ]
      },
      {
        "type": "observation",
        "observation": [
          {
            "_id": "chat1",
            "participants": [
              {
                "_id": "user2",
                "username": "janesmith"
              }
            ],
            "name": "Jane Chat",
            "isGroupChat": false
          },
          {
            "_id": "chat3",
            "name": "Project Team",
            "isGroupChat": true,
            "participants": [
              {
                "_id": `${userId}`.toString(),
                "username": "john"
              },
              {
                "_id": "user3",
                "username": "bob"
              },
              {
                "_id": "user7",
                "username": "emma"
              }
            ]
          }
        ]
      },
      {
        "type": "action",
        "function": "getChatMessages",
        "input": [
          "chat3"
        ]
      },
      {
        "type": "observation",
        "observation": [
          {
            "_id": "message4",
            "sender": {
              "_id": `${userId}`.toString(),
              "username": "john"
            },
            "text": "Welcome to the Project Team chat!",
            "createdAt": "2024-04-25T10:05:00.000Z"
          },
          {
            "_id": "message5",
            "sender": {
              "_id": "user3",
              "username": "bob"
            },
            "text": "Thanks for creating this group!",
            "createdAt": "2024-04-25T10:10:00.000Z"
          }
        ]
      },
      {
        "type": "output",
        "output": "Here are the messages from the Project Team group chat:- john: Welcome to the Project Team chat!- bob: Thanks for creating this group!"
      }
    ],

    "Handle a case when a user doesn't exist": [
      {
        "type": "user",
        "user": "Send a message to alex saying 'Hello'"
      },
      {
        "type": "plan",
        "plan": "I need to find alex's user ID, then find or create a chat, and send a message"
      },
      {
        "type": "action",
        "function": "getUser",
        "input": [
          { "username": "alex" }
        ]
      },
      {
        "type": "observation",
        "observation": null
      },
      {
        "type": "output",
        "output": "I couldn't find a user with the username 'alex'. Please check the spelling or try another username."
      }
    ],

    "Create a new chat with a user": [
      {
        "type": "user",
        "user": "Start a new chat with emma"
      },
      {
        "type": "plan",
        "plan": "I need to find emma's user ID, check if a chat already exists, and create one if it doesn't"
      },
      {
        "type": "action",
        "function": "getUser",
        "input": [
          { "username": "emma" }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "user7",
          "username": "emma",
          "email": "emma@example.com",
          "profilePic": "emma.jpg"
        }
      },
      {
        "type": "action",
        "function": "getChatBySenderReceiver",
        "input": [
          `${userId}`,
          "user7"
        ]
      },
      {
        "type": "observation",
        "observation": null
      },
      {
        "type": "action",
        "function": "createChat",
        "input": [
          {
            "isGroupChat": false,
            "participants": [`${userId}`, "user7"]
          }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "chat4",
          "isGroupChat": false,
          "participants": [
            { "_id": `${userId}`, "username": "john" },
            { "_id": "user7", "username": "emma" }
          ],
          "createdAt": "2024-04-25T11:30:00.000Z"
        }
      },
      {
        "type": "output",
        "output": "I've created a new chat between you and emma. You can now send messages to each other."
      }
    ],

    "Accept a friend request": [
      {
        "type": "user",
        "user": "Accept friend request from emma"
      },
      {
        "type": "plan",
        "plan": "I need to find emma's user ID, check if there's a pending request from her then accept it"
      },
      {
        "type": "action",
        "function": "getUser",
        "input": [
          { "username": "emma" }
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "user7",
          "username": "emma",
          "email": "emma@example.com",
          "profilePic": "emma.jpg"
        }
      },
      {
        "type": "action",
        "function": "getRequestsByUserId",
        "input": [
          `${userId}`
        ]
      },
      {
        "type": "observation",
        "observation": [
          [
            {
              "_id": "req1",
              "sender": { "_id": `${userId}`, "username": "john" },
              "receiver": { "_id": "user6", "username": "david" },
              "status": "pending",
              "createdAt": "2024-04-20T14:30:00.000Z"
            }
          ],
          [
            {
              "_id": "req2",
              "sender": { "_id": "user7", "username": "emma" },
              "receiver": { "_id": `${userId}`, "username": "john" },
              "status": "pending",
              "createdAt": "2024-04-22T09:15:00.000Z"
            }
          ]
        ]
      },
      {
        "type": "action",
        "function": "updateRequestStatus",
        "input": [
          "req2",
          "accepted"
        ]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "req2",
          "sender": {
            "_id": "user7",
            "username": "emma"
          },
          "receiver": {
            "_id": `${userId}`.toString(),
            "username": "john"
          },
          "status": "accepted",
          "createdAt": "2024-04-22T09:15:00.000Z"
        }
      },
      {
        "type": "output",
        "output": "You have accepted emma's friend request."
      }
    ],

    "Get a specific message": [
      {
        "type": "user",
        "user": "Show me message with ID message4"
      },
      {
        "type": "plan",
        "plan": "I will use getMessageById to retrieve the specific message"
      },
      {
        "type": "action",
        "function": "getMessageById",
        "input": ["message4"]
      },
      {
        "type": "observation",
        "observation": {
          "_id": "message4",
          "sender": {
            "_id": `${userId}`.toString(),
            "username": "john"
          },
          "text": "Welcome to the Project Team chat!",
          "chat": {
            "_id": "chat3",
            "name": "Project Team",
            "isGroupChat": true
          },
          "createdAt": "2024-04-25T10:05:00.000Z"
        }
      },
      {
        "type": "output",
        "output": "Here's the message: 'Welcome to the Project Team chat!' - sent by you in the Project Team group chat on April 25."
      }
    ]
  }
}