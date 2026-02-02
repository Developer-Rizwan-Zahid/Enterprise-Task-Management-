using Microsoft.AspNetCore.SignalR;

namespace TaskService.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendTaskUpdate(string message)
        {
            await Clients.All.SendAsync("ReceiveTaskUpdate", message);
        }
    }
}
