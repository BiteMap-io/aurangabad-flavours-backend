import User, { IUser } from '../models/user.model';

export async function createUser(data: { name: string; email: string; avatarKey?: string }): Promise<IUser> {
  const user = new User(data);
  return user.save();
}

export async function getUserById(id: string): Promise<IUser | null> {
  return User.findById(id).exec();
}

export async function listUsers(): Promise<IUser[]> {
  return User.find().limit(50).exec();
}
