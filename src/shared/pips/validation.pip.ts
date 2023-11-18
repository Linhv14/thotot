import { ForbiddenException, ValidationPipe } from '@nestjs/common';

// Prevent user from update confidential fields such as: password, role, ...etc
// Only accept DTO format
export const UserValidationPipe = new ValidationPipe({
  whitelist: true,
});