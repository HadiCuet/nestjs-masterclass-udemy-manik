import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(
        // Inject AuthService
        private readonly authService: AuthService,
    ) {}

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    public async login(@Body() signInDto: SignInDto) {
        return await this.authService.signIn(signInDto);
    }
}
