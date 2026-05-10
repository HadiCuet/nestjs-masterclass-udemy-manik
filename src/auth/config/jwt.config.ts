import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
    secret: process.env.JWT_SECRET,
    tokenAudience: process.env.JWT_TOKEN_AUDIENCE,
    tokenIssuer: process.env.JWT_TOKEN_ISSUER,
    tokenExpirationTtl: parseInt(
        process.env.JWT_TOKEN_EXPIRATION_TTL ?? '3600',
        10,
    ),
    refreshTokenTtl: parseInt(
        process.env.JWT_REFRESH_TOKEN_TTL ?? '864000',
        10,
    ),
}));
