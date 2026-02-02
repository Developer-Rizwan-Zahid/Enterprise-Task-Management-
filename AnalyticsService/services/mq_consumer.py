import pika
import json
import os
import threading
from sqlalchemy.orm import Session
from models.models import SessionLocal, TaskAnalytics

def callback(ch, method, properties, body):
    print(f" [x] Received {body}")
    data = json.loads(body)
    
    db: Session = SessionLocal()
    try:
        task_data = data.get("Data")
        if task_data:
            analytics = TaskAnalytics(
                task_id=task_data.get("Id"),
                title=task_data.get("Title"),
                status=task_data.get("Status"),
                assigned_to_user_id=task_data.get("AssignedToUserId")
            )
            db.add(analytics)
            db.commit()
            print(f" [x] Saved to analytics DB")
    except Exception as e:
        print(f" [!] Error processing message: {e}")
    finally:
        db.close()

def start_consumer():
    import time
    rabbitmq_url = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
    params = pika.URLParameters(rabbitmq_url)
    
    while True:
        try:
            print(f" [*] Attempting to connect to RabbitMQ at {rabbitmq_url}...")
            connection = pika.BlockingConnection(params)
            channel = connection.channel()

            channel.exchange_declare(exchange='task_events', exchange_type='fanout')
            result = channel.queue_declare(queue='', exclusive=True)
            queue_name = result.method.queue

            channel.queue_bind(exchange='task_events', queue=queue_name)

            print(' [*] Connected to RabbitMQ. Waiting for messages...')
            channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
            channel.start_consuming()
        except pika.exceptions.AMQPConnectionError:
            print(" [!] RabbitMQ connection failed. Retrying in 5 seconds...")
            time.sleep(5)
        except Exception as e:
            print(f" [!] Unexpected error in consumer: {e}")
            time.sleep(5)


def run_consumer_thread():
    thread = threading.Thread(target=start_consumer, daemon=True)
    thread.start()
