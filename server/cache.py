"""
Caching!
"""

from werkzeug.contrib.cache import SimpleCache

CACHE_TIMEOUT = 300  # 6 minute cache
cache = SimpleCache()


class should_cache_request(object):

    def __init__(self, timeout=None):
        self.timeout = timeout or CACHE_TIMEOUT

    def __call__(self, f):
        def decorator(*args, **kwargs):
            response = cache.get(request.path)
            if response is None:
                response = f(*args, **kwargs)
                cache.set(request.path, response, self.timeout)
            return response
        return decorator


class should_cache_function(object):

    def __init__(self, name, timeout=None):
        self.name = "FUNCTION_CACHE__" + name
        self.timeout = timeout or CACHE_TIMEOUT

    def __call__(self, f):
        def decorator(*args, **kwargs):
            response = cache.get(self.name)
            if response is None:
                response = f(*args, **kwargs)
                cache.set(self.name, response, self.timeout)
            return response
        return decorator
