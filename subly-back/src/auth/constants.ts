export const jwtConstants: { secret: string } = {
  secret: process.env.JWT_SECRET || 'dev-secret',
};
