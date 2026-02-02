using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskService.Data;
using TaskService.DTOs;
using TaskService.Models;
using TaskService.Services;

namespace TaskService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TaskDbContext _context;
        private readonly IAuthService _authService;

        public AuthController(TaskDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto dto)
        {
            var username = dto.Username.Trim().ToLower();
            var email = dto.Email.Trim().ToLower();
            
            if (await _context.Users.AnyAsync(u => u.Username == username))
                return BadRequest("Username already exists");
            
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == email))
                return BadRequest("Email already registered");

            var user = new User
            {
                Username = username,
                Email = email,
                Role = dto.Role,
                PasswordHash = _authService.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            var identifier = dto.Username.Trim().ToLower();
            Console.WriteLine($"Login attempt for identifier: {identifier}");
            
            // Search by Username OR Email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == identifier || u.Email.ToLower() == identifier);
            
            if (user == null)
            {
                Console.WriteLine($"User not found with identifier: {identifier}");
                return Unauthorized("Invalid username or password");
            }

            Console.WriteLine($"User found: {user.Username}. Verifying password...");
            bool isPasswordValid = _authService.VerifyPassword(dto.Password, user.PasswordHash);
            
            if (!isPasswordValid)
            {
                Console.WriteLine($"Password verification failed for user: {user.Username}");
                return Unauthorized("Invalid username or password");
            }

            Console.WriteLine($"Login successful for user: {user.Username}");
            var accessToken = _authService.GenerateAccessToken(user);
            var refreshToken = _authService.GenerateRefreshToken();



            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            return Ok(new TokenDto { AccessToken = accessToken, RefreshToken = refreshToken });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequestDto dto)
        {
            var principal = _authService.GetPrincipalFromExpiredToken(dto.AccessToken);
            var username = principal.Identity?.Name;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null || user.RefreshToken != dto.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return BadRequest("Invalid client request");

            var newAccessToken = _authService.GenerateAccessToken(user);
            var newRefreshToken = _authService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            await _context.SaveChangesAsync();

            return Ok(new TokenDto { AccessToken = newAccessToken, RefreshToken = newRefreshToken });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var username = User.Identity?.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return BadRequest();

            user.RefreshToken = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();

            return Ok(new { user.Id, user.Username, user.Email, user.Role });
        }
    }
}
