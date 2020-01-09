import random
import string


def random_id_string(stringLength=6):
    """Generate a random string of letters and digits """
    available_characters = string.ascii_lowercase + string.digits
    return ''.join(random.choice(available_characters) for i in range(stringLength))


def random_number_string(stringLength=6):
    """Generate a random string of letters and digits """
    available_characters = string.digits
    return ''.join(random.choice(available_characters) for i in range(stringLength))
