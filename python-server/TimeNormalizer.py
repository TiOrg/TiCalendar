# -*- coding: utf-8 -*-

import pickle
import regex as re
import arrow

from StringPreHandler import StringPreHandler
from TimePoint import TimePoint
from TimeUnit import TimeUnit


def cut_sent(para):
    para = re.sub(u'([。！？\?;；])([^”’])', r"\1\n\2", para)  # 单字符断句符
    para = re.sub('(\.{6})([^”’])', r"\1\n\2", para)  # 英文省略号
    para = re.sub('(\…{2})([^”’])', r"\1\n\2", para)  # 中文省略号
    para = re.sub(u'([。！？\?][”’])([^，。！？\?])', r"\1\n\2", para)
    # 如果双引号前有终止符，那么双引号才是句子的终点，把分句符\n放到双引号后，注意前面的几句都小心保留了双引号
    para = para.rstrip()  # 段尾如果有多余的\n就去掉它
    # 很多规则中会考虑分号;，这里忽略不计，破折号、英文双引号等同样忽略，需要的再做些简单调整即可。
    return para

# 时间表达式识别的主要工作类


class TimeNormalizer:
    def __init__(self):
        # with open(path, 'rb') as f:
        #     self.pattern = pickle.load(f)
        # print(self.pattern)
        self.isPreferFuture = False
        self.pattern = re.compile(u'''([0-9]{2}(年))|([0-9]?[0-9]{3}(年))|(((周|星期))[1-7])|(((10)|(11)|(12)|([1-9]))(月))|((10)|(11)|(12)|([1-9])|本|下个?)(月)(([0-3][0-9]|[1-9])|(上旬)|(前半月)|(中旬)|(后半月)|(下旬)|(末)|(底))?|((?<!\\d)([0-3][0-9]|[1-9])[日|号])|(?<!(周|星期))([0-2]?[0-9])(点|时)(半|[1一]刻(?!钟)|[3三]刻(?!钟))?([0-5]?[0-9](分钟?))?|((((?<!小)[点时]))[0-5][0-9](?!刻))|([0-5]?[0-9](秒))|((分)[0-5]?[0-9])|(?<!(周|星期))([0-2]?[0-9]):[0-5][0-9]:[0-5][0-9]|(?<!(周|星期))([0-2]?[0-9]):[0-5][0-9]|[0-9]?[0-9]?[0-9]{2}-((10)|(11)|(12)|([1-9]))-((?<!\\d))([0-3][0-9]|[1-9])|((10)|(11)|(12)|([1-9]))/((?<!\\d))([0-3][0-9]|[1-9])/[0-9]?[0-9]?[0-9]{2}|([0-9]?[0-9]?[0-9]{2}\\.((10)|(11)|(12)|([1-9]))\\.((?<!\\d))([0-3][0-9]|[1-9]))|\\d+(?=天[以之]?(前|后))|\\d+(?=(个)?月[以之]?(前|后))|\\d+(?=年[以之]?(前|后))|((前|去|今|明|后)年)|(上(个)?月)|((本|这个)月)|(下(个)?月)|(大(前|后)天)|((?<!大)(前|后)天)|(今(天|日))|(明(天|日))|(((上上(周|星期)))[1-7]?)|((((?<!上)上(周|星期)))[1-7]?)|((((?<!下)下(周|星期)))[1-7]?)|(((下下(周|星期)))[1-7]?)|((((?<!(上|下))(周|星期)))[1-7])|凌晨|早晨|晨间|早|上午|(中午)|(午间)|(下午)|(午后)|(pm)|(PM)|晚|夜间|夜里|([0-5]?[0-9](分(?!钟)))''', re.U)

    def _filter(self, input_query):
        input_query = StringPreHandler.numberTranslator(input_query)

        rule = u"[0-9]月[0-9]"
        pattern = re.compile(rule)
        match = pattern.search(input_query)
        if match != None:
            index = input_query.find(u'月')
            rule = u"日|号"
            pattern = re.compile(rule)
            match = pattern.search(input_query[index:])
            if match == None:
                rule = u"[0-9]月[0-9]+"
                pattern = re.compile(rule)
                match = pattern.search(input_query)
                if match != None:
                    end = match.span()[1]
                    input_query = input_query[:end] + u'号' + input_query[end:]

        rule = u"月"
        pattern = re.compile(rule)
        match = pattern.search(input_query)
        if match == None:
            input_query = input_query.replace(u'个', u'')

        input_query = input_query.replace(u'：', u':')
        input_query = input_query.replace(u'(', u'')
        input_query = input_query.replace(u')', u'')
        input_query = input_query.replace(u'（', u'')
        input_query = input_query.replace(u'）', u'')
        return input_query


    def parse(self, target):
        """
        TimeNormalizer的构造方法，timeBase取默认的系统当前时间
        :param target: 待分析字符串
        :return: 时间单元数组
        """
        self.target = self._filter(target)
        self.timeBase = arrow.now().format('YYYY-M-D-H-m-s')
        self.oldTimeBase = self.timeBase
        self.__preHandling()
        # print self.target
        self.timeToken = self.__timeEx()
        #print self.timeToken

    def __preHandling(self):
        """
        待匹配字符串的清理空白符和语气助词以及大写数字转化的预处理
        :return:
        """
        self.target = StringPreHandler.delKeyword(
            self.target, u"\\s+")  # 清理空白符
        self.target = StringPreHandler.delKeyword(
            self.target, u"[的]+")  # 清理语气助词
        # self.target = StringPreHandler.numberTranslator(self.target)  # 大写数字转化

    def __timeEx(self):
        """

        :param target: 输入文本字符串
        :param timeBase: 输入基准时间
        :return: TimeUnit[]时间表达式类型数组
        """
        res = []

        sents = cut_sent(re.sub(
            'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '[url]', self.target)).split('\n')
        for sent in sents:

            startline = -1
            endline = -1
            rpointer = 0
            temp = []
            match = self.pattern.finditer(sent)

            for m in match:
                # print(m.group())
                startline = m.start()
                if startline == endline:
                    rpointer -= 1
                    temp[rpointer] = temp[rpointer] + m.group()
                else:
                    temp.append(m.group())

                endline = m.end()
                rpointer += 1

            if rpointer > 0:
                if sent.find('将') != -1:
                    isPreferFuture = True
                    # print('future!!')
                else:
                    isPreferFuture = False
                self.isPreferFuture = isPreferFuture

            # 时间上下文： 前一个识别出来的时间会是下一个时间的上下文，用于处理：周六3点到5点这样的多个时间的识别，第二个5点应识别到是周六的。
            contextTp = TimePoint()
            for i in range(0, rpointer):
                res.append(TimeUnit(temp[i], self, contextTp, sent, isPreferFuture))
                contextTp = res[i].tp
        res = self.__filterTimeUnit(res)
        return res

    def __filterTimeUnit(self, tu_arr):
        """
        过滤timeUnit中无用的识别词。无用识别词识别出的时间是1970.01.01 00:00:00(fastTime=0)
        :param tu_arr:
        :return:
        """
        if (tu_arr is None) or (len(tu_arr) < 1):
            return tu_arr
        res = []
        for tu in tu_arr:
            if tu.time.timestamp != 0:
                res.append(tu)
        return res
