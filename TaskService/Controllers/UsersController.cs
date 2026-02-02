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
    [Authorize(Roles = "Admin,Manager")]
    public class UsersController : ControllerBase
    {
        private readonly TaskDbContext _context;
        private readonly IAuthService _authService;

        public UsersController(TaskDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<User>> CreateUser(UserRegisterDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Role = dto.Role,
                PasswordHash = _authService.HashPassword(dto.Password)
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Email = dto.Email;
            user.Role = dto.Role;
            user.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRole(int id, RoleUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Role = dto.Role;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<User>>> GetActiveUsers()
        {
            return await _context.Users.Where(u => u.IsActive).ToListAsync();
        }
    }
}
