import { UserService } from "../services/userService";
import { ApiResponse, User } from "../types";

export class UserController {
    constructor(
      private userService: UserService,
      private corsHeaders: HeadersInit
    ) {}
  
    async createUser(request: Request): Promise<Response> {
      try {
        const body = await request.json() as Omit<User, 'created_at'>;
        
        if (!this.validateUserInput(body)) {
          return this.errorResponse('Invalid user data', 400);
        }
  
        await this.userService.createUser(body);
        return this.jsonResponse({ success: true });
      } catch (error) {
        console.error('Error creating user:', error);
        return this.errorResponse('Failed to create user');
      }
    }
  
    async getUser(id: string): Promise<Response> {
      try {
        const user = await this.userService.getUserById(id);
        
        if (!user) {
          return this.errorResponse('User not found', 404);
        }
  
        return this.jsonResponse({ success: true, data: user });
      } catch (error) {
        console.error('Error fetching user:', error);
        return this.errorResponse('Failed to fetch user');
      }
    }
  
    private validateUserInput(user: Partial<User>): boolean {
      return Boolean(
        user.username?.trim() &&
        user.display_name?.trim() &&
        user.email?.trim() &&
        user.id
      );
    }
  
    private jsonResponse(data: ApiResponse<unknown>, status = 200): Response {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          'Content-Type': 'application/json',
          ...this.corsHeaders,
        },
      });
    }
  
    private errorResponse(error: string, status = 500): Response {
      return this.jsonResponse({ success: false, error }, status);
    }
  }