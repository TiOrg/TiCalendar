# coding: utf-8

import leancloud
import re
from TimeNormalizer import TimeNormalizer
import Query4m3
import sys
from datetime import datetime

reload(sys)
sys.setdefaultencoding("utf-8")

engine = leancloud.Engine()


@engine.define
def parse_str(**params):
    tn = TimeNormalizer()
    # print("hello is called")
    if 'str' in params:
        text = params['str'].encode('utf-8')
        tn.parse(text)
        ret = []
        for token in tn.timeToken:
            datetime = token.time.for_json()
            event = token.sent.replace('\n','')
            ret.append({'time':datetime, 'event':event})
        return ret


@engine.define
def hello(**params):
    # print("hello is called")
    if 'name' in params:
        return 'Hello, {}!'.format(params['name'])
    else:
        return 'Hello, LeanCloud!'


# @engine.before_save('Todo')
# def before_todo_save(todo):
#     content = todo.get('content')
#     if not content:
#         raise leancloud.LeanEngineError('内容不能为空')
#     if len(content) >= 240:
#         todo.set('content', content[:240] + ' ...')


@engine.define
def refresh_events(**params):
    # print("hello is called")
    Event = leancloud.Object.extend('Events')

    username = params['username']
    password = params['password']
    eventnum = params['num']

    if eventnum > 50:
        raise leancloud.LeanEngineError('Too many events requests, dont be too gready!')

    q = Query4m3.Query4m3()
    q.login(username, password)

    query = Event.query
    query.select('msgid')
    event_found = query.find()

    eventids = []
    for event in event_found:
        eventids.append(event.get('msgid'))
    eventids = list(set(eventids))
    events, times = q.refreshEvents(eventnum, eventids)


    index = 0
    for event in events:
        newevent = Event()
        newevent.set('title', event['title'])
        newevent.set('msgid', int(event['msgid']))
        newevent.set('url', event['url'])
        newevent.set('dateTime', datetime.fromtimestamp(times[index].timestamp))
        newevent.set('content', event['content'])
        newevent.save()
        index = index + 1

    return len(events)

    # print(times)
    # return events
        
    
   
