import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RolesSchema } from './schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RolesSchema }]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
