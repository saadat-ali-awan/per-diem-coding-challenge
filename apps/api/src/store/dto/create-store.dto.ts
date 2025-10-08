import { IsString, Length, Matches, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @Length(2, 30)
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Subdomain must be lowercase and contain only letters, numbers, and dashes',
  })
  subDomain: string;

  @IsString()
  @Length(2, 50)
  name: string;

  @IsOptional()
  @IsString()
  welcome?: string;

  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Primary color must be a valid hex color (e.g. #2563eb)',
  })
  primary?: string;

  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Background color must be a valid hex color (e.g. #ffffff)',
  })
  background?: string;

  @IsOptional()
  @IsString()
  fontFamily?: string;
}
