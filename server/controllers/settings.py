from server.models.setting import Setting
from server.app import db
from server.server_constants import *
import datetime


def get_setting(user, key, override=False):
    if not override and not user.admin_is:
        return None
    setting = Setting.query.filter_by(key=key).first()
    if (setting is None):
        return None
    else:
        return setting.value

def get_public_settings():
    """
    Returns all key:value pairings for settings that are free to use!
    """
    res = []
    for key in SETTINGS_PUBLIC:
        setting = Setting.query.filter_by(key=key).first()
        if (setting is not None):
            res.append(setting)
    return res

def get_all_settings(user, override=False):
    if not override and not user.admin_is:
        return None
    return Setting.query.all()

def set_setting(user, key, value, override=False):
    if not override and not user.admin_is:
        return False
    if (not override and key in SETTINGS_ENV_PERMENANT):
        return False
    setting = Setting.query.filter_by(key=key).first()
    if (setting is not None):
        setting.value = value
        setting.date_updated = datetime.datetime.now()
        db.session.commit()
    else:
        setting = Setting(key, value)
        db.session.add(setting)
        db.session.commit()
    return True
