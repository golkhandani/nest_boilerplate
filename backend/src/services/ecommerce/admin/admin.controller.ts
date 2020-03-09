import { Controller, UseGuards, Post, Get, Query, Param, Put, Body, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles, UserGuard as RoleGuard } from '@shared/guards';
import { UserRoles } from '@shared/models/users.model';
import { UsersProfileProvider } from '@services/profiles/profiles.provider';
import { ParseLimitPipe, ParseOffsetPipe } from '@shared/pipes';

@Controller(AdminController.path)
@ApiTags(AdminController.path)
export class AdminController {

  public static path: string = 'admin';
  constructor(
    private readonly profileService: UsersProfileProvider,
  ) { }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @Get('/users')
  getAllUsers(
    @Query('limit', new ParseLimitPipe()) limit: number,
    @Query('offset', new ParseOffsetPipe()) offset: number,
  ) {
    return this.profileService.getProfiles(limit, offset);
  }

}
