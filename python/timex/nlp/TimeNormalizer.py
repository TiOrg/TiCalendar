#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/11/20 16:39
# @Author  : zhm
# @File    : TimeNormalizer.py
# @Software: PyCharm
import pickle
import regex as re
import arrow

from StringPreHandler import StringPreHandler
from TimePoint import TimePoint
from TimeUnit import TimeUnit

def cut_sent(para):
    para = re.sub(u'([。！？\?])([^”’])', r"\1\n\2", para)  # 单字符断句符
    para = re.sub('(\.{6})([^”’])', r"\1\n\2", para)  # 英文省略号
    para = re.sub('(\…{2})([^”’])', r"\1\n\2", para)  # 中文省略号
    para = re.sub(u'([。！？\?][”’])([^，。！？\?])', r"\1\n\2", para)
    # 如果双引号前有终止符，那么双引号才是句子的终点，把分句符\n放到双引号后，注意前面的几句都小心保留了双引号
    para = para.rstrip()  # 段尾如果有多余的\n就去掉它
    # 很多规则中会考虑分号;，这里忽略不计，破折号、英文双引号等同样忽略，需要的再做些简单调整即可。
    return para

# 时间表达式识别的主要工作类
class TimeNormalizer:
    def __init__(self, path='reg.pkl', isPreferFuture=True):
        self.isPreferFuture = isPreferFuture
        with open(path, 'rb') as f:
            self.pattern = pickle.load(f)

    def parse(self, target):
        """
        TimeNormalizer的构造方法，timeBase取默认的系统当前时间
        :param target: 待分析字符串
        :return: 时间单元数组
        """
        self.target = target
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
        self.target = StringPreHandler.delKeyword(self.target, u"\\s+")  # 清理空白符
        self.target = StringPreHandler.delKeyword(self.target, u"[的]+")  # 清理语气助词
        self.target = StringPreHandler.numberTranslator(self.target)  # 大写数字转化

    # def timeEx(self):
    #     """

    #     :param target: 输入文本字符串
    #     :param timeBase: 输入基准时间
    #     :return: TimeUnit[]时间表达式类型数组
    #     """
    #     startline = -1
    #     endline = -1
    #     rpointer = 0
    #     temp = []
    #     match = self.pattern.finditer(self.target)

    #     index = 0
    #     indextemp = []
    #     for m in match:
    #         startline = m.start()
    #         if startline == endline:
    #             rpointer -= 1
    #             temp[rpointer] = temp[rpointer] + m.group()
    #         else:
    #             temp.append(m.group())
    #             print(self.target[endline: startline])
    #             index += self.target[endline: startline].count('\n')
    #             indextemp.append(index)
                
    
    #         endline = m.end()
    #         rpointer += 1
    #     res = []
    #     for i in range(0,len(temp)):
    #         print(temp[i] + '   ' + str(indextemp[i]))
    #     # 时间上下文： 前一个识别出来的时间会是下一个时间的上下文，用于处理：周六3点到5点这样的多个时间的识别，第二个5点应识别到是周六的。
    #     contextTp = TimePoint()
    #     for i in range(0, rpointer):
    #         res.append(TimeUnit(temp[i], self, contextTp, indextemp[i]))
    #         contextTp = res[i].tp
    #     res = self.__filterTimeUnit(res)
    #     return res

    def __timeEx(self):
        """

        :param target: 输入文本字符串
        :param timeBase: 输入基准时间
        :return: TimeUnit[]时间表达式类型数组
        """
        res = []
                
        sents = cut_sent(self.target).split('\n')
        for sent in sents:
            startline = -1
            endline = -1
            rpointer = 0
            temp = []
            match = self.pattern.finditer(sent)

            for m in match:
                startline = m.start()
                if startline == endline:
                    rpointer -= 1
                    temp[rpointer] = temp[rpointer] + m.group()
                else:
                    temp.append(m.group())
        
                endline = m.end()
                rpointer += 1

            # 时间上下文： 前一个识别出来的时间会是下一个时间的上下文，用于处理：周六3点到5点这样的多个时间的识别，第二个5点应识别到是周六的。
            contextTp = TimePoint()
            for i in range(0, rpointer):
                res.append(TimeUnit(temp[i], self, contextTp, sent))
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
