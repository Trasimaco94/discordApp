import { TMessage, TRoom, TUser } from './declarations';

// #region ::: UTILITIES
const getInitialUserLogged = () => {
  return !!localStorage.getItem('userLogged') ? JSON.parse(localStorage.getItem('userLogged')!) : null;
};

const getInitialRooms = () => {
  return !!localStorage.getItem('rooms') ? JSON.parse(localStorage.getItem('rooms')!) : [];
};

const getInitialUsers = () => {
  return !!localStorage.getItem('users')
    ? JSON.parse(localStorage.getItem('users')!)
    : [
        {
          id: 'secret-id',
          username: 'riccardogenova',
          password: '12345',
        },
      ];
};
// #endregion

export class AppDiscord {
  #userLogged: Pick<TUser, 'username' | 'id'> | null = getInitialUserLogged();
  #rooms: Array<TRoom> = getInitialRooms();
  #users: Array<TUser> = getInitialUsers();
  #onlineUsers: Array<TUser['id']> = [];

  constructor() {
    console.log('AppDiscord created');
    console.log('userLogged', this.#userLogged);
    console.log('rooms', this.#rooms);
    console.log('users', this.#users);
    console.log('onlineUsers', this.#onlineUsers);
  }

  #checkUserExists(username: TUser['username']) {
    const isAlreadySignup = this.#users.some(user => user.username === username);
    return isAlreadySignup;
  }
  #checkIsSuperAdmin() {
    if (!this.#userLogged) throw new Error('You are not logged in');
    const isSuperAdmin = this.#userLogged.id === 'secret-id';
    return isSuperAdmin;
  }
  signup({ username, password }: { username: TUser['username']; password: TUser['password'] }) {
    if (!!this.#userLogged) throw new Error('You are already logged in');

    const isAlreadySignup = this.#checkUserExists(username);
    if (isAlreadySignup) throw new Error('User already exists');
    else {
      const newUser: TUser = { id: Math.random().toString(), username, password };
      this.#users = [...this.#users, newUser];
      console.log(`User ${newUser.username} created`);
      const user = this.login({ username, password });
      localStorage.setItem('users', JSON.stringify(this.#users));
      return user;
    }
  }
  login({ username, password }: { username: TUser['username']; password: TUser['password'] }) {
    if (!!this.#userLogged) throw new Error('You are already logged in');

    const user = this.#users.find(user => user.username === username && user.password === password);
    if (!user) throw new Error('User not found');
    else {
      this.#userLogged = { username: user.username, id: user.id };
      this.#onlineUsers = [...this.#onlineUsers, user.id];
      console.log(`User ${user.username} logged in`);
      localStorage.setItem('userLogged', JSON.stringify(this.#userLogged));
      return { username: user.username, id: user.id };
    }
  }
  logout() {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');
    this.#onlineUsers = this.#onlineUsers.filter(id => id !== this.#userLogged!.id);
    this.#userLogged = null;
    console.log('User logged out');
  }
  getUserLogged() {
    return this.#userLogged;
  }
  getOnlineUsers() {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');
    return this.#onlineUsers;
  }
  //   SUPER ADMIN
  getAllUsers() {
    const isSuperAdmin = this.#checkIsSuperAdmin();
    if (!isSuperAdmin) throw new Error('You are not allowed to do this');
    return this.#users;
  }
  getAllRooms() {
    const isSuperAdmin = this.#checkIsSuperAdmin();
    if (!isSuperAdmin) throw new Error('You are not allowed to do this');
    return this.#rooms;
  }
  createRoom(name: TRoom['name']) {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');

    const room: TRoom = {
      id: Math.random().toString(),
      name,
      messages: [],
      users: [{ idUser: this.#userLogged!.id, permission: 'admin' }],
      private: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.#rooms = [...this.#rooms, room];
    console.log(`Room ${room.name} created`);
    localStorage.setItem('rooms', JSON.stringify(this.#rooms));
    return room;
  }

  getRoomList() {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');

    const filteredPublicRooms = this.#rooms.filter(room => !room.private);
    const filteredRooms = filteredPublicRooms.map(room => ({ id: room.id, name: room.name }));
    return filteredRooms;
  }

  deleteRoom(name: TRoom['name']) {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');
  
    const isAdmin = this.#rooms.some(room => {
      const isAdminInRoom = room.users.some(user => user.idUser === this.#userLogged!.id && user.permission === 'admin');
      return isAdminInRoom;
    });
  
    if (!isAdmin) throw new Error('You are not allowed to delete rooms');
  
    const roomIndex = this.#rooms.findIndex(room => room.name === name);
    if (roomIndex === -1) throw new Error('Room not found');
  
    const deletedRoom = this.#rooms.splice(roomIndex, 1)[0];
    console.log(`Room ${deletedRoom.name} deleted`);
    localStorage.setItem('rooms', JSON.stringify(this.#rooms));
  
    return deletedRoom;
  }
  

  inviteRoom({ roomName, userId, permission = 'user' }: { roomName: TRoom['name']; userId: TUser['id']; permission?: 'moderator' | 'user' }) {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');
  
    const isAdmin = this.#rooms.some(room => {
      const isAdminInRoom = room.users.some(user => user.idUser === this.#userLogged!.id && user.permission === 'admin');
      return isAdminInRoom;
    });
  
    if (!isAdmin) throw new Error('You are not allowed to invite users');
  
    const roomIndex = this.#rooms.findIndex(room => room.name === roomName);
    if (roomIndex === -1) throw new Error('Room not found');
  
    const isUserExist = this.#users.some(user => user.id === userId);
    if (!isUserExist) throw new Error('User not found');
  
    const isUserAlreadyInRoom = this.#rooms[roomIndex].users.some(user => user.idUser === userId);
    if (isUserAlreadyInRoom) throw new Error('User is already in the room');
  
    const updatedRoom = {
      ...this.#rooms[roomIndex],
      users: [...this.#rooms[roomIndex].users, { idUser: userId, permission }],
    };
  
    this.#rooms[roomIndex] = updatedRoom;
  
    console.log(`User ${userId} invited to room ${roomName}`);
    localStorage.setItem('rooms', JSON.stringify(this.#rooms));
  }
  

  writeMessage({ roomName, content, replyTo }: { roomName: TRoom['name']; content: TMessage['content']; replyTo?: TMessage['id'] }) {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');
  
    const roomIndex = this.#rooms.findIndex(room => room.name === roomName);
    if (roomIndex === -1) throw new Error('Room not found');
  
    const userInRoom = this.#rooms[roomIndex].users.find(user => user.idUser === this.#userLogged!.id);
    if (!userInRoom) throw new Error('You are not a member of this room');
  
    const message: TMessage = {
      id: Math.random().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      content,
      idUser: this.#userLogged!.id,
      idRoom: this.#rooms[roomIndex].id,
      ref: replyTo || ''
    };
  
    this.#rooms[roomIndex].messages.push(message);
    console.log(`Message written in room ${roomName}`);
  
    localStorage.setItem('rooms', JSON.stringify(this.#rooms));
  }
  
  deleteMessage({ roomName, messageId }: { roomName: TRoom['name']; messageId: TMessage['id'] }) {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');
  
    const roomIndex = this.#rooms.findIndex(room => room.name === roomName);
    if (roomIndex === -1) throw new Error('Room not found');
  
    const userInRoom = this.#rooms[roomIndex].users.find(user => user.idUser === this.#userLogged!.id);
    if (!userInRoom) throw new Error('You are not a member of this room');
  
    const messageIndex = this.#rooms[roomIndex].messages.findIndex(message => message.id === messageId);
    if (messageIndex === -1) throw new Error('Message not found');
  
    this.#rooms[roomIndex].messages.splice(messageIndex, 1);
    console.log(`Message ${messageId} deleted from room ${roomName}`);
  
    localStorage.setItem('rooms', JSON.stringify(this.#rooms));
  }
  

  getMessageList(roomName: TRoom['name']) {
    const isLogged = !!this.#userLogged;
    if (!isLogged) throw new Error('You are not logged in');
  
    const room = this.#rooms.find(room => room.name === roomName);
    if (!room) throw new Error('Room not found');
  
    const userInRoom = room.users.find(user => user.idUser === this.#userLogged!.id);
    if (!userInRoom) throw new Error('You are not a member of this room');
  
    return room.messages.map(message => ({
      id: message.id,
      content: message.content,
      author: this.#users.find(user => user.id === message.idUser)?.username || 'Unknown',
      createdAt: message.createdAt,
    }));
  }
  
}

