import datetime
import uuid
from dimagi.utils.parsing import json_format_datetime
from django.template.loader import render_to_string

from receiver.util import spoof_submission

from corehq.apps.domain.models import Domain
from corehq.apps.receiverwrapper.util import get_submit_url

def submit_case_blocks(case_blocks, domain, username="system", user_id="",
                       xmlns='http://commcarehq.org/case'):
    now = json_format_datetime(datetime.datetime.utcnow())
    if not isinstance(case_blocks, basestring):
        case_blocks = ''.join(case_blocks)
    form_xml = render_to_string('hqcase/xml/case_block.xml', {
        'xmlns': xmlns,
        'case_block': case_blocks,
        'time': now,
        'uid': uuid.uuid4().hex,
        'username': username,
        'user_id': user_id,
    })
    spoof_submission(
        get_submit_url(domain),
        form_xml,
        hqsubmission=False,
    )

def get_case_wrapper(data):
    from corehq.apps.commtrack.models import get_case_wrapper
    
    wrapper = None

    try:
        if Domain.get_by_name(data['domain']).commtrack_enabled:
            wrapper = get_case_wrapper(data)
    except Exception:
        pass

    return wrapper
