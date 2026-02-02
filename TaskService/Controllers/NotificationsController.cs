using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskService.DTOs;

namespace TaskService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        [HttpPost("email")]
        public IActionResult SendEmail(NotificationDto dto)
        {
            // Logic to trigger background email service
            Console.WriteLine($"--> Sending email to {dto.Recipient}: {dto.Subject}");
            return Ok(new { message = "Email queued successfully" });
        }

        [HttpPost("task-alert")]
        public IActionResult SendTaskAlert(NotificationDto dto)
        {
            // Logic to trigger task alert
            Console.WriteLine($"--> Sending task alert: {dto.Subject}");
            return Ok(new { message = "Task alert sent successfully" });
        }
    }
}
