import { IsArray, IsUUID, ArrayMaxSize } from 'class-validator';

export class SaveFavoritesDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMaxSize(5)
  famousPersonIds: string[];
}
