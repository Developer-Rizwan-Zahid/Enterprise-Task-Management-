using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

namespace TaskService.Services
{
    public interface IMessageBusClient
    {
        void PublishTaskEvent(string eventType, object taskData);
    }

    public class RabbitMQClient : IMessageBusClient, IDisposable
    {
        private readonly IConfiguration _config;
        private readonly IConnection? _connection;
        private readonly IModel? _channel;

        public RabbitMQClient(IConfiguration config)
        {
            _config = config;
            var factory = new ConnectionFactory() { HostName = _config["RabbitMQ:Host"] ?? "localhost", Port = int.Parse(_config["RabbitMQ:Port"] ?? "5672") };
            try
            {
                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();
                _channel.ExchangeDeclare(exchange: "task_events", type: ExchangeType.Fanout);
                Console.WriteLine("--> Connected to Message Bus");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--> Could not connect to the Message Bus: {ex.Message}");
            }
        }

        public void PublishTaskEvent(string eventType, object taskData)
        {
            if (_connection != null && _connection.IsOpen)
            {
                var message = JsonSerializer.Serialize(new { Event = eventType, Data = taskData });
                SendMessage(message);
            }
        }

        private void SendMessage(string message)
        {
            var body = Encoding.UTF8.GetBytes(message);
            _channel?.BasicPublish(exchange: "task_events", routingKey: "", basicProperties: null, body: body);
            Console.WriteLine($"--> Message sent: {message}");
        }

        public void Dispose()
        {
            if (_channel != null && _channel.IsOpen)
            {
                _channel.Close();
                _connection?.Close();
            }
        }
    }
}
