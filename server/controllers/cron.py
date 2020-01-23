from server.models.client import Client
import datetime
from server.models import remove_from_db

def cron_job():
    try:
        clean_old_clients()
    except:
        pass


def clean_old_clients():
    current_time = datetime.datetime.utcnow()
    one_month_ago = current_time - datetime.timedelta(weeks=4)
    remove_from_db(Client.query.filter(Client.date_created < one_month_ago).all())
    print("Cleaned old clients")