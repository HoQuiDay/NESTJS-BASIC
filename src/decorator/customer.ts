import { SetMetadata, createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
export const IS_PUBLIC_KEY = 'isPublic';
export const RESPONSE_MESSAGE = 'response_message';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContextHost) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
