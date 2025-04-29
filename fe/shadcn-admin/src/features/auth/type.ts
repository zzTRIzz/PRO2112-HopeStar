export default interface JwtPayload {
  iat: number;
  exp: number;
  email: string;
  role: string;
}