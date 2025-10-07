import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('getuser/:refreshtoken')
    getuser(
        @Param('refreshtoken') refreshtoken: string)
    {
        return this.userService.getuser(refreshtoken);
    }
}
