import { Users } from 'src/users/user.entity';

declare module 'express' {
  interface Request {
    user: Users;
  }
}
