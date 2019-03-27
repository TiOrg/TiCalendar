#coding=utf-8
import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
import sys
import re
from bs4 import BeautifulSoup
from TimeNormalizer import TimeNormalizer
import re

reload(sys)
sys.setdefaultencoding("UTF-8")

class Query4m3(object):
    _RE_SAMLResponse = re.compile(r'name="SAMLResponse"\s*value="([\w\d\+\/=]*)"')
    _RE_SAMLURL = re.compile(r';url=([^"]*)"')
    _RE_RelayState = re.compile(r'name="RelayState"\s*value="([\w\d\_\-]*)"')
    _RE_ID = re.compile(r'"ids","(\d+)"')
    _RE_MSGParse = re.compile('getNewNoticeInfo\\(\'([0-9]+)\'\\);">(.*?)</a>')
    _RE_span = re.compile(r'<span (.*?)>(.*?)</span>')

    HOST_4M3 = "http://4m3.tongji.edu.cn"
    HOST_IDS = "https://ids.tongji.edu.cn:8443"

    def __init__(self):
        self.w4m3Session = requests.Session()
        self.proxies = {}
        self.w4m3Session.get(self.HOST_4M3, proxies = self.proxies)
        self.headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", 
            "Connection": "keep-alive",}
        self.id = 0

    def login(self, stuID, passwd):
        # from samlCheck get samlURL to redirect to ids.tongji.edu.cn
        r = self.w4m3Session.get(self.HOST_4M3 + "/eams/samlCheck", proxies = self.proxies)
        samlURL = self._RE_SAMLURL.findall(r.text)[0]

        headers = dict(self.headers).update({"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","Referer": "http://4m3.tongji.edu.cn/eams/samlCheck"})

        self.w4m3Session.get(samlURL, headers = headers, verify = False, proxies = self.proxies)
        # now w4m3Session has a sessionkey containing info from 4m3.tongji.edu.cn

        # now submit id and pwd
        headers = dict(self.headers).update({"Origin": "https://ids.tongji.edu.cn:8443", "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://ids.tongji.edu.cn:8443/nidp/app/login?id=443&sid=0&option=credential&sid=0"})
        loginURL = self.HOST_IDS + "/nidp/saml2/sso?sid=0&sid=0"
        loginData = {"option": "credential", "Ecom_User_ID": stuID, "Ecom_Password": passwd, "submit": "\xe7\x99\xbb\xe5\xbd\x95"}
        self.w4m3Session.post(loginURL, loginData, headers = headers, verify = False, proxies = self.proxies)

        # jump and get samlvariables
        submitURL = self.HOST_IDS + "/nidp/saml2/sso?sid=0"
        submitData = {}
        headers = dict(self.headers).update({"Host": "ids.tongji.edu.cn:8443", "Referer":  self.HOST_IDS + "/nidp/saml2/sso?sid=0&sid=0"})
        r = self.w4m3Session.post(submitURL, headers = headers, verify = False, proxies = self.proxies)
        
        # now we jump back
        SAMLVarText = r.text

        if len(self._RE_SAMLResponse.findall(SAMLVarText)) == 0:
            raise ValueError, u"Login Failed. ID or password error?"

        SAMLVar = {"SAMLResponse": self._RE_SAMLResponse.findall(SAMLVarText)[0], "RelayState": self._RE_RelayState.findall(SAMLVarText)[0]}
        headers = dict(self.headers).update({"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"})
        self.w4m3Session.post(self.HOST_4M3 + "/eams/saml/SAMLAssertionConsumer", SAMLVar, headers = headers, proxies = self.proxies)


    def getMessage(self, msgnum, eventids):
        # r = self.w4m3Session
        
        http = urllib3.PoolManager()

        url = self.HOST_4M3 + '/eams/home!welcome.action'
        res = self.w4m3Session.get(url, proxies = self.proxies)
        # soup = BeautifulSoup(res.text)
        # print(res.text)
        results = self._RE_MSGParse.findall(res.text)
        # print(results)
        cnt = 0
        res = []
    
        for result in results:
            # print(result)
            msgid = result[0]
            
            cnt = cnt+1
            if int(msgid) in eventids:
                if msgnum > 0 and cnt >= msgnum:
                    break
                else:
                    continue

            title = result[1]

            msgurl = self.HOST_4M3 + '/eams/noticeDocument!info.action?ifMain=1&notice.id=' + msgid
            # print(title)
            # print(msgurl)

            msgres = self.w4m3Session.get(msgurl, proxies = self.proxies)

            msg = msgres.text.encode('utf-8')

            soup = BeautifulSoup(msg, features="html.parser")
            # print(soup.find_all('span'))
            text = soup.find_all('span') + soup.find_all('font')
            text = text[:len(text)/2]

            msgcontent = ''
            for s in text:
                msgcontent = msgcontent + s.get_text()
            res.append({'title': title,'id':msgid, 'url': msgurl, 'content':msgcontent})

            if msgnum > 0 and cnt >= msgnum:
                break

            # out = open(path + msgid + '.txt', "w")

            # for s in text:
            #     out.write(s.get_text().encode('utf-8'))
            # out.close()


            # res = re.findall(self._RE_span, msg)

            # for word in res:
            #     f.write(word[1].replace('&nbsp', ' '))
            # f.write(msgres.text.encode("utf-8"))

            # print(msgres.text)
        return res

    def refreshEvents(self, msgcnt, eventids):
        
        tn = TimeNormalizer()

        res = self.getMessage(msgcnt, eventids)

        times = []
        events = []
        for msg in res:
            text = msg['content']
            if text:
                tn.parse(text)
               
                event_existed = []
                time_existed = []

                for token in tn.timeToken:
                    datetime = token.time

                    event = token.sent.replace('\n','')
                    if len(event) > 150:
                        event = event[:150] + '...'
                    
                    if event in event_existed:
                        print(event)
                        # index = event_existed.index(event)
                        indices = [i for i, x in enumerate(event_existed) if x == event]

                        should_jump = False
                        for index in indices:
                            if time_existed[index] == datetime:
                                should_jump = True
                                break
                        if should_jump == True:
                            continue
                        

                    event_existed.append(event)
                    time_existed.append(datetime)

                    # print(timestr + ' --- ' + event)
                    events.append({'title':msg['title'],'msgid':msg['id'],'url':msg['url'],'content':event})
                    times.append(datetime)
        return events, times
