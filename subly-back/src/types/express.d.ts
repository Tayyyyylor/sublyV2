import { Users } from 'src/users/users.entity';

declare module 'express' {
  interface Request {
    user: Users;
  }
}
