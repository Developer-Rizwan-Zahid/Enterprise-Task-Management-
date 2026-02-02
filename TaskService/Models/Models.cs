using System.Text.Json.Serialization;

namespace TaskService.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Employee"; 
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        
        [JsonIgnore]
        public List<TaskItem> Tasks { get; set; } = new();
    }

    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Todo"; 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        public int AssignedToUserId { get; set; }
        public User? AssignedTo { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
