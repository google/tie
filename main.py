# Copyright 2015 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Cloud Datastore NDB API guestbook sample.
This sample is used on this page:
    https://cloud.google.com/appengine/docs/python/ndb/
For more information, see README.md
"""

# [START all]
import cgi
import logging
import urllib

from google.appengine.ext import ndb

import webapp2
from webapp2_extras.routes import RedirectRoute






def get_redirect_route(regex_route, handler, defaults=None):
    """Returns a route that redirects /foo/ to /foo.
    Warning: this method strips off parameters after the trailing slash. URLs
    with parameters should be formulated without the trailing slash.
    """
    logging.info('hello')
    if defaults is None:
        defaults = {}
    name = regex_route.replace('/', '_')
    return RedirectRoute(
        regex_route, handler, name, strict_slash=True, defaults=defaults)

# [START submit]
class StoreCode(webapp2.RequestHandler):

    def post(self):
        # We set the parent key on each 'Greeting' to ensure each guestbook's
        # greetings are in the same entity group.
        logging.info('booyah')
        code = self.request.get('code')
        self.response.out.write(code)
# [END submit]


logging.info('hello')

app = webapp2.WSGIApplication([
    get_redirect_route(r'/', StoreCode),
    get_redirect_route(r'/server/submit', StoreCode),
    get_redirect_route(r'/<:.*>', StoreCode),
])
# [END all]