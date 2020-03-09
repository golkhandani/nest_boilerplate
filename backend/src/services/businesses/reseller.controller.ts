import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResellerService } from './reseller.provider';
import { ResellerGuard, ResellerFromHeader } from '@shared/guards/reseller.guard';
import { Scopes, Roles, UserGuard as RoleGuard } from '@shared/guards';
import { UserRoles } from '@shared/models';
import { UserScopes } from '@services/authorization/models';

@Controller(ResellerController.path)
@ApiTags(ResellerController.path)
export class ResellerController {

  public static path = 'resellers';
  constructor(
    private readonly resellerService: ResellerService,
  ) { }

  @UseGuards(ResellerGuard)
  @Get('ping')
  async ping(
    @ResellerFromHeader() reseller,
  ) {
    return 'pong';
  }

  @Post('')
  async addReseller(
    @Body() reseller,
  ) {
    return {
      data: await this.resellerService.createResseller(reseller),
    };
  }
}
