using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskService.Data;
using TaskService.DTOs;
using TaskService.Models;
using TaskService.Services;
using Microsoft.AspNetCore.SignalR;
using System.Net.Http.Json;

namespace TaskService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly TaskDbContext _context;
        private readonly IMessageBusClient _messageBus;
        private readonly Microsoft.AspNetCore.SignalR.IHubContext<TaskService.Hubs.NotificationHub> _hubContext;
        private readonly IHttpClientFactory _httpClientFactory;

        public TasksController(TaskDbContext context, IMessageBusClient messageBus, Microsoft.AspNetCore.SignalR.IHubContext<TaskService.Hubs.NotificationHub> hubContext, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _messageBus = messageBus;
            _hubContext = hubContext;
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            return await _context.Tasks.Include(t => t.AssignedTo).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            var task = await _context.Tasks.Include(t => t.AssignedTo).FirstOrDefaultAsync(t => t.Id == id);
            if (task == null) return NotFound();
            return task;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskCreateDto dto)
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                DueDate = dto.DueDate,
                AssignedToUserId = dto.AssignedToUserId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            
            // Sync to Analytics and Hub
            _messageBus.PublishTaskEvent("TaskCreated", task);
            await SyncToAnalytics(task);
            await _hubContext.Clients.All.SendAsync("ReceiveTaskUpdate", "TaskCreated");

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateTask(int id, TaskUpdateDto dto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.DueDate = dto.DueDate;
            task.AssignedToUserId = dto.AssignedToUserId;
            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            
            // Sync to Analytics and Hub
            _messageBus.PublishTaskEvent("TaskUpdated", task);
            await SyncToAnalytics(task);
            await _hubContext.Clients.All.SendAsync("ReceiveTaskUpdate", "TaskUpdated");

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            _messageBus.PublishTaskEvent("TaskDeleted", new { Id = id });
            await _hubContext.Clients.All.SendAsync("ReceiveTaskUpdate", "TaskDeleted");

            return NoContent();
        }

        [HttpPost("{id}/assign")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> AssignTask(int id, TaskAssignDto dto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.AssignedToUserId = dto.UserId;
            await _context.SaveChangesAsync();
            
            // Sync to Analytics and Hub
            _messageBus.PublishTaskEvent("TaskAssigned", task);
            await SyncToAnalytics(task);
            await _hubContext.Clients.All.SendAsync("ReceiveTaskUpdate", "TaskAssigned");

            return Ok(new { message = "Task assigned successfully" });
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Status = status;
            task.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            
            // Sync to Analytics and Hub
            _messageBus.PublishTaskEvent("TaskStatusUpdated", task);
            await SyncToAnalytics(task);
            await _hubContext.Clients.All.SendAsync("ReceiveTaskUpdate", "TaskStatusUpdated");

            return NoContent();
        }

        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetMyTasks()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return await _context.Tasks.Where(t => t.AssignedToUserId == userId).ToListAsync();
        }

        [HttpGet("overdue")]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetOverdueTasks()
        {
            return await _context.Tasks
                .Where(t => t.DueDate < DateTime.UtcNow && t.Status != "Done")
                .Include(t => t.AssignedTo)
                .ToListAsync();
        }
        private async Task SyncToAnalytics(TaskItem task)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.PostAsJsonAsync("http://localhost:8000/analytics/log", new
                {
                    Id = task.Id,
                    Title = task.Title,
                    Status = task.Status,
                    AssignedToUserId = task.AssignedToUserId
                });
                Console.WriteLine($"--> Direct Analytics Sync Status: {response.StatusCode}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--> Direct Analytics Sync Failed: {ex.Message}");
            }
        }
    }
}
