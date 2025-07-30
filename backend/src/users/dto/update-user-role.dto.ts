import { IsEnum, IsDefined } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserRoleDto {
  @IsDefined()
  @IsEnum(Role)
  role: Role;
}
