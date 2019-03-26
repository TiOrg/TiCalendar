# coding: utf-8

from leancloud import Engine
from leancloud import LeanEngineError
import re
from TimeNormalizer import TimeNormalizer
import Query4m3
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

engine = Engine()


@engine.define
def parse_str(**params):
    tn = TimeNormalizer()
    # print("hello is called")
    if 'str' in params:
        text = params['str'].encode('utf-8')
        tn.parse(text)
        ret = []
        for token in tn.timeToken:
            timestr = token.time.format("YYYY-MM-DD HH:mm:ss")
            event = re.sub(u'\d[\.、]','',token.sent).replace('\n','')
            ret.append({'timestr':timestr, 'event':event})
        return ret


# @engine.define
# def hello(**params):
#     # print("hello is called")
#     if 'name' in params:
#         return 'Hello, {}!'.format(params['name'])
#     else:
#         return 'Hello, LeanCloud!'


# @engine.before_save('Todo')
# def before_todo_save(todo):
#     content = todo.get('content')
#     if not content:
#         raise LeanEngineError('内容不能为空')
#     if len(content) >= 240:
#         todo.set('content', content[:240] + ' ...')


@engine.define
def refresh_events(**params):
    # print("hello is called")
    username = params['username']
    password = params['password']
    eventnum = int(params['num'])

    if eventnum > 50:
        return 'error: Too many events requests'

    q = Query4m3.Query4m3()
    q.login(username, password)
    return q.refreshEvents(eventnum)
    
   
