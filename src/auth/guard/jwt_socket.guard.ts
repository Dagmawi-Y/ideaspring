import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class JwtSocketGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToWs().getClient<Socket>(); // Get the WebSocket client
    const authHeader = request.handshake.headers['authorization']; // Extract token from headers
    if (authHeader) {
      request.handshake.headers['authorization'] = authHeader; // Attach the token to request headers
    }
    return super.canActivate(context);
  }
}
