import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/User";
import { UserRepository } from "../../domain/repository/UserRepository";
import bcrypt from 'bcrypt';


export class MysqlUserRepository implements UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getById(userId: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          datos: true,
        },
      });
  
      if (!user) return null;
  
      return new User(
        user.id,
        user.name,
        user.email,
        user.password,
        user.datos 
      );
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }
  

  async deleteUser(id: number): Promise<User | null> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      return new User(deletedUser.id, deletedUser.name, deletedUser.email, deletedUser.password);
    } catch (error) {
      console.error("Error deleting user:", error);
      return null;
    }
  }

  async createUser(name: string, email: string, password: string): Promise<User | null> {
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      return new User(createdUser.id, createdUser.name, createdUser.email, createdUser.password);
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }


  async login(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email, 
        },
      });
  
      if (!user) return null;
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) return null;
  
      return user;
    } catch (error) {
      console.error("Error logging in:", error);
      return null;
    }
  }
  




}
