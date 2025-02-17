// src/middleware/auth.ts

export const requireAuth = async (request: Request) => {
    const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
    
    if (!jwt) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Authentication required'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  
    try {
      // Decode JWT payload
      const [, payloadBase64] = jwt.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      
      return {
        isAuthenticated: true,
        user: {
          email: payload.email,
          id: payload.sub,
          name: payload.name
        }
      };
    } catch (error) {
      console.log('Error decoding JWT:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid authentication token'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };