#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2017/11/20 17:01
# @Author  : zhm
# @File    : TimeUnit.py
# @Software: PyCharm
import regex as re
import arrow
import copy
from TimePoint import TimePoint
from RangeTimeEnum import RangeTimeEnum

initTime = arrow.get('1970-01-01 00:00:00')
# 时间语句分析
class TimeUnit:
    def __init__(self, exp_time, normalizer, contextTp, sent):
        self.exp_time = exp_time.replace('：',':')
        # print(self.exp_time)
        self.normalizer = normalizer
        self.tp = TimePoint()
        self.tp_origin = contextTp
        self.isFirstTimeSolveContext = True
        self.isAllDayTime = True
        self.time = initTime

        if self.checkLegal() == True:
            try:
                self.time_normalization()
            except:
                print('ERROR:' + self.exp_time)

        self.sent = sent
        print(self.time.format("YYYY-MM-DD HH:mm:ss --- ") + self.exp_time)

    def checkLegal(self):
        if len(self.exp_time) > 10 and self.exp_time[:10].isdigit(): # 20101231 
            return False
        return True
        
    def time_normalization(self):
        self.norm_setyear()
        self.norm_setmonth()
        self.norm_setday()
        self.norm_setmonth_fuzzyday()
        self.norm_setBaseRelated()
        self.norm_setCurRelated()
        self.norm_sethour()
        self.norm_setminute()
        self.norm_setsecond()
        self.norm_setSpecial()
        self.modifyTimeBase()
        self.tp_origin.tunit = copy.deepcopy(self.tp.tunit)

        time_grid = self.normalizer.timeBase.split('-')
        tunitpointer = 5
        while tunitpointer >= 0 and self.tp.tunit[tunitpointer] < 0:
            tunitpointer -= 1
        for i in range(0, tunitpointer-1):
            if self.tp.tunit[i] < 0:
                self.tp.tunit[i] = int(time_grid[i])
        if 10 <= self.tp.tunit[0] < 100:
            self.tp.tunit[0]= int('19' + str(self.tp.tunit[0]))
        if 0 < self.tp.tunit[0] < 10:
            self.tp.tunit[0] = int('200' + str(self.tp.tunit[0]))

        self.time = self.genTime(self.tp.tunit)

    def genTime(self, tunit):        
        # time = arrow.utcnow()
        if all(t <=0 for t in tunit[1:]): #不接受只有年份的信息
            return initTime
        
        time = initTime

        if tunit[0] > 0: 
            time = time.replace(year=tunit[0])  
        else: #无年份默认本年
            time = time.replace(year=arrow.now().year)

        if tunit[1] > 0:
            time = time.replace(month=tunit[1])
        if tunit[2] > 0:
            time = time.replace(day=tunit[2])
        if tunit[3] > 0:
            time = time.replace(hour=tunit[3])
        if tunit[4] > 0:
            time = time.replace(minute=tunit[4])
        if tunit[5] > 0:
            time = time.replace(second=tunit[5])
        return time

    def norm_setyear(self):
        """
        年-规范化方法--该方法识别时间表达式单元的年字段
        :return:
        """
        # 两数表示的年份
        rule = u"[0-9]{2}(?=年)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            year = int(match.group())
            if year < 50:
                year += 2000  # 50以下表示2000年以后的年份
            else:
                year += 1900  # 否则表示1900年以后的年份
            self.tp.tunit[0] = year
        # 三位数和四位数表示的年份
        rule = u"[0-9]?[0-9]{3}(?=年)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            year = int(match.group())
            self.tp.tunit[0] = year

    def norm_setmonth(self):
        """
        月-规范化方法--该方法识别时间表达式单元的月字段
        :return:
        """
        rule = u"((10)|(11)|(12)|([1-9]))(?=月)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[1] = int(match.group())
            # 处理倾向于未来时间的情况
            self.preferFuture(1)

        rule = u"春"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[1] = 1
            # 处理倾向于未来时间的情况
            self.preferFuture(1)

        rule = u"夏"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[1] = 6
            # 处理倾向于未来时间的情况
            self.preferFuture(1)

        rule = u"秋"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[1] = 9
            # 处理倾向于未来时间的情况
            self.preferFuture(1)

        rule = u"冬"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[1] = 12
            # 处理倾向于未来时间的情况
            self.preferFuture(1)
            
    def norm_setmonth_fuzzyday(self):
        """
        月-日 兼容模糊写法：该方法识别时间表达式单元的月、日字段
        :return:
        """
        rule = u"((10)|(11)|(12)|([1-9]))(月|\\.|\\-)([0-3][0-9]|[1-9])"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            matchStr = match.group()
            p = re.compile(u"(月|\\.|\\-)")
            m = p.search(matchStr)
            if match is not None:
                splitIndex = m.start()
                month = matchStr[0: splitIndex]
                day = matchStr[splitIndex + 1:]
                self.tp.tunit[1] = int(month)
                self.tp.tunit[2] = int(day)
                # 处理倾向于未来时间的情况
                self.preferFuture(1)

        rule = u"((10)|(11)|(12)|([1-9]))(月|\\.|\\-)([上旬][前半月])"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            matchStr = match.group()
            p = re.compile(u"(月|\\.|\\-)")
            m = p.search(matchStr)
            if match is not None:
                splitIndex = m.start()
                month = matchStr[0: splitIndex]
                day = matchStr[splitIndex + 1:]
                self.tp.tunit[1] = int(month)
                self.tp.tunit[2] = 1
                # 处理倾向于未来时间的情况
                self.preferFuture(1)

        rule = u"((10)|(11)|(12)|([1-9]))(月|\\.|\\-)([中旬])"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            matchStr = match.group()
            p = re.compile(u"(月|\\.|\\-)")
            m = p.search(matchStr)
            if match is not None:
                splitIndex = m.start()
                month = matchStr[0: splitIndex]
                day = matchStr[splitIndex + 1:]
                self.tp.tunit[1] = int(month)
                self.tp.tunit[2] = 10
                # 处理倾向于未来时间的情况
                self.preferFuture(1) 

        rule = u"((10)|(11)|(12)|([1-9]))(月|\\.|\\-)([中][后半月])"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            matchStr = match.group()
            p = re.compile(u"(月|\\.|\\-)")
            m = p.search(matchStr)
            if match is not None:
                splitIndex = m.start()
                month = matchStr[0: splitIndex]
                day = matchStr[splitIndex + 1:]
                self.tp.tunit[1] = int(month)
                self.tp.tunit[2] = 15
                # 处理倾向于未来时间的情况
                self.preferFuture(1)

        rule = u"((10)|(11)|(12)|([1-9]))(月|\\.|\\-)([下旬])"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            matchStr = match.group()
            p = re.compile(u"(月|\\.|\\-)")
            m = p.search(matchStr)
            if match is not None:
                splitIndex = m.start()
                month = matchStr[0: splitIndex]
                day = matchStr[splitIndex + 1:]
                self.tp.tunit[1] = int(month)
                self.tp.tunit[2] = 20
                # 处理倾向于未来时间的情况
                self.preferFuture(1)

    def norm_setday(self):
        """
        日-规范化方法：该方法识别时间表达式单元的日字段
        :return:
        """
        # rule = u"((?<!\\d))([0-3][0-9]|[1-9])(?=(日|号))"
        rule = u"((?<!\\d))([0-3][0-9]|[1-9])(?=(日))"

        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[2] = int(match.group())
            # 处理倾向于未来时间的情况
            self.preferFuture(2)

    def norm_sethour(self):
        """
        时-规范化方法：该方法识别时间表达式单元的时字段
        :return:
        """
        rule = u"(?<!(周|星期))([0-2]?[0-9])(?=(点|时))"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[3] = int(match.group())
            # 处理倾向于未来时间的情况
            self.preferFuture(3)
            self.isAllDayTime = False

        # * 对关键字：早（包含早上/早晨/早间），上午，中午,午间,下午,午后,晚上,傍晚,晚间,晚,pm,PM的正确时间计算
        # * 规约：
        # * 1.中午/午间0-10点视为12-22点
        # * 2.下午/午后0-11点视为12-23点
        # * 3.晚上/傍晚/晚间/晚1-11点视为13-23点，12点视为0点
        # * 4.0-11点pm/PM视为12-23点
        rule = u"凌晨"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            if self.tp.tunit[3] == -1: # 增加对没有明确时间点，只写了“凌晨”这种情况的处理
                self.tp.tunit[3] = RangeTimeEnum.day_break
                # 处理倾向于未来时间的情况
                self.preferFuture(3)
                self.isAllDayTime = False

        rule = u"早上|早晨|早间|晨间|今早|明早"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            if self.tp.tunit[3] == -1:  # 增加对没有明确时间点，只写了“早上/早晨/早间”这种情况的处理
                self.tp.tunit[3] = RangeTimeEnum.early_morning
                # 处理倾向于未来时间的情况
                self.preferFuture(3)
                self.isAllDayTime = False

        rule = u"上午"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            if self.tp.tunit[3] == -1:  # 增加对没有明确时间点，只写了“上午”这种情况的处理
                self.tp.tunit[3] = RangeTimeEnum.morning
                # 处理倾向于未来时间的情况
                self.preferFuture(3)
                self.isAllDayTime = False

        rule = u"(中午)|(午间)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            if 0 <= self.tp.tunit[3] <= 10:
                self.tp.tunit[3] += 12
            if self.tp.tunit[3] == -1:  # 增加对没有明确时间点，只写了“中午/午间”这种情况的处理
                self.tp.tunit[3] = RangeTimeEnum.noon
            # 处理倾向于未来时间的情况
            self.preferFuture(3)
            self.isAllDayTime = False

        rule = u"(下午)|(午后)|(pm)|(PM)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            if 0 <= self.tp.tunit[3] <= 11:
                self.tp.tunit[3] += 12
            if self.tp.tunit[3] == -1:  # 增加对没有明确时间点，只写了“下午|午后”这种情况的处理
                self.tp.tunit[3] = RangeTimeEnum.afternoon
            # 处理倾向于未来时间的情况
            self.preferFuture(3)
            self.isAllDayTime = False

        rule = u"晚上|夜间|夜里|今晚|明晚"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            if 0 <= self.tp.tunit[3] <= 10:
                self.tp.tunit[3] += 12
            elif self.tp.tunit[3] == 12:
                self.tp.tunit[3] = 0
            elif self.tp.tunit[3] == -1:  # 增加对没有明确时间点，只写了“下午|午后”这种情况的处理
                self.tp.tunit[3] = RangeTimeEnum.afternoon
            # 处理倾向于未来时间的情况
            self.preferFuture(3)
            self.isAllDayTime = False

    def norm_setminute(self):
        """
        分-规范化方法：该方法识别时间表达式单元的分字段
        :return:
        """
        rule = u"([0-5]?[0-9](?=分(?!钟)))|((?<=((?<!小)[点时]))[0-5]?[0-9](?!刻))"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            if match.group() != '':
                self.tp.tunit[4] = int(match.group())
                # 处理倾向于未来时间的情况
                self.preferFuture(4)
                self.isAllDayTime = False
        # 加对一刻，半，3刻的正确识别（1刻为15分，半为30分，3刻为45分）
        rule = u"(?<=[点时])[1一]刻(?!钟)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[4] = 15
            # 处理倾向于未来时间的情况
            self.preferFuture(4)
            self.isAllDayTime = False

        rule = u"(?<=[点时])半"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[4] = 30
            # 处理倾向于未来时间的情况
            self.preferFuture(4)
            self.isAllDayTime = False

        rule = u"(?<=[点时])[3三]刻(?!钟)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[4] = 45
            # 处理倾向于未来时间的情况
            self.preferFuture(4)
            self.isAllDayTime = False

    def norm_setsecond(self):
        """
        添加了省略“秒”说法的时间：如17点15分32
        :return:
        """
        rule = u"([0-5]?[0-9](?=秒))|((?<=分)[0-5]?[0-9])"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            self.tp.tunit[5] = int(match.group())
            self.isAllDayTime = False

    def norm_setSpecial(self):
        """
        特殊形式的规范化方法-该方法识别特殊形式的时间表达式单元的各个字段
        :return:
        """
        rule = u"(?<!(周|星期))([0-2]?[0-9]):[0-5]?[0-9]:[0-5]?[0-9]"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            tmp_target = match.group()
            tmp_parser = tmp_target.split(":")
            self.tp.tunit[3] = int(tmp_parser[0])
            self.tp.tunit[4] = int(tmp_parser[1])
            self.tp.tunit[5] = int(tmp_parser[2])
            # 处理倾向于未来时间的情况
            self.preferFuture(3)
            self.isAllDayTime = False
        else:
            rule = u"(?<!(周|星期))([0-2]?[0-9]):[0-5]?[0-9]"
            pattern = re.compile(rule)
            match = pattern.search(self.exp_time)
            if match is not None:
                tmp_target = match.group()
                tmp_parser = tmp_target.split(":")
                self.tp.tunit[3] = int(tmp_parser[0])
                self.tp.tunit[4] = int(tmp_parser[1])
                # 处理倾向于未来时间的情况
                self.preferFuture(3)
                self.isAllDayTime = False

        rule = u"[0-9]?[0-9]?[0-9]{2}-((10)|(11)|(12)|([1-9]))-((?<!\\d))([0-3][0-9]|[1-9])"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            tmp_target = match.group()
            tmp_parser = tmp_target.split("-")
            self.tp.tunit[0] = int(tmp_parser[0])
            self.tp.tunit[1] = int(tmp_parser[1])
            self.tp.tunit[2] = int(tmp_parser[2])

        rule = u"((10)|(11)|(12)|([1-9]))/((?<!\\d))([0-3][0-9]|[1-9])/[0-9]?[0-9]?[0-9]{2}"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            tmp_target = match.group()
            tmp_parser = tmp_target.split("/")
            self.tp.tunit[1] = int(tmp_parser[0])
            self.tp.tunit[2] = int(tmp_parser[1])
            self.tp.tunit[0] = int(tmp_parser[2])

        rule = u"[0-9]?[0-9]?[0-9]{2}\\.((10)|(11)|(12)|([1-9]))\\.((?<!\\d))([0-3][0-9]|[1-9])"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            tmp_target = match.group()
            tmp_parser = tmp_target.split("\\.")
            self.tp.tunit[0] = int(tmp_parser[0])
            self.tp.tunit[1] = int(tmp_parser[1])
            self.tp.tunit[2] = int(tmp_parser[2])

    def norm_setBaseRelated(self):
        """
        设置以上文时间为基准的时间偏移计算
        :return:
        """
        cur = arrow.get(self.normalizer.timeBase, "YYYY-M-D-H-m-s")
        flag = [False, False, False]

        rule = u"\\d+(?=天[以之]?前)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            day = int(match.group())
            cur = cur.shift(days=-day)

        rule = u"\\d+(?=天[以之]?后)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            day = int(match.group())
            cur = cur.shift(days=day)

        rule = u"\\d+(?=(个)?月[以之]?前)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[1] = True
            month = int(match.group())
            cur = cur.shift(months=-month)

        rule = u"\\d+(?=(个)?月[以之]?后)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[1] = True
            month = int(match.group())
            cur = cur.shift(months=month)

        rule = u"\\d+(?=年[以之]?前)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[0] = True
            year = int(match.group())
            cur = cur.shift(years=-year)

        rule = u"\\d+(?=年[以之]?后)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[0] = True
            year = int(match.group())
            cur = cur.shift(years=year)

        if flag[0] or flag[1] or flag[2]:
            self.tp.tunit[0] = int(cur.year)
        if flag[1] or flag[2]:
            self.tp.tunit[1] = int(cur.month)
        if flag[2]:
            self.tp.tunit[2] = int(cur.day)

    def norm_setCurRelated(self):
        """
        设置当前时间相关的时间表达式
        :return:
        """
        cur = arrow.get(self.normalizer.timeBase, "YYYY-M-D-H-m-s")
        flag = [False, False, False]

        rule = u"前年"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[0] = True
            cur = cur.shift(years=-2)

        rule = u"去年"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[0] = True
            cur = cur.shift(years=-1)

        rule = u"今年"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[0] = True
            cur = cur.shift(years=0)

        rule = u"明年"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[0] = True
            cur = cur.shift(years=1)

        rule = u"后年"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[0] = True
            cur = cur.shift(years=2)

        rule = u"上(个)?月"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[1] = True
            cur = cur.shift(months=-1)

        rule = u"(本|这个)月"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[1] = True
            cur = cur.shift(months=0)

        rule = u"下(个)?月"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[1] = True
            cur = cur.shift(months=1)

        rule = u"大前天"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            cur = cur.shift(days=-3)

        rule = u"(?<!大)前天"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            cur = cur.shift(days=-2)

        rule = u"昨"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            cur = cur.shift(days=-1)

        rule = u"今(?!年)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            cur = cur.shift(days=0)

        rule = u"明(?!年)"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            cur = cur.shift(days=1)

        rule = u"(?<!大)后天"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            cur = cur.shift(days=2)

        rule = u"大后天"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            cur = cur.shift(days=3)

        # todo 补充星期相关的预测
        rule = u"(?<=(上上(周|星期)))[1-7]?"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            try:
                week = int(match.group())
            except:
                week = 1
            week -= 1
            span = week - cur.weekday()
            cur = cur.replace(weeks=-2, days=span)

        rule = u"(?<=((?<!上)上(周|星期)))[1-7]?"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            try:
                week = int(match.group())
            except:
                week = 1
            week -= 1
            span = week - cur.weekday()
            cur = cur.replace(weeks=-1, days=span)

        rule = u"(?<=((?<!下)下(周|星期)))[1-7]?"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            try:
                week = int(match.group())
            except:
                week = 1
            week -= 1
            span = week - cur.weekday()
            cur = cur.replace(weeks=1, days=span)

        rule = u"(?<=(下下(周|星期)))[1-7]?"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            try:
                week = int(match.group())
            except:
                week = 1
            week -= 1
            span = week - cur.weekday()
            cur = cur.replace(weeks=2, days=span)

        rule = u"(?<=((?<!(上|下))(周|星期)))[1-7]?"
        pattern = re.compile(rule)
        match = pattern.search(self.exp_time)
        if match is not None:
            flag[2] = True
            try:
                week = int(match.group())
            except:
                week = 1
            week -= 1
            span = week - cur.weekday()
            cur = cur.replace(days=span)
            # 处理未来时间
            cur = self.preferFutureWeek(week, cur)

        if flag[0] or flag[1] or flag[2]:
            self.tp.tunit[0] = int(cur.year)
        if flag[1] or flag[2]:
            self.tp.tunit[1] = int(cur.month)
        if flag[2]:
            self.tp.tunit[2] = int(cur.day)

    def modifyTimeBase(self):
        """
        该方法用于更新timeBase使之具有上下文关联性
        :return:
        """
        time_grid = self.normalizer.timeBase.split('-')
        arr = []
        for i in range(0, 6):
            if self.tp.tunit[i] == -1:
                arr.append(str(time_grid[i]))
            else:
                arr.append(str(self.tp.tunit[i]))
        self.normalizer.timeBase = '-'.join(arr)

    def preferFutureWeek(self, weekday, cur):
        # 1. 确认用户选项
        if not self.normalizer.isPreferFuture:
            return cur
        # 2. 检查被检查的时间级别之前，是否没有更高级的已经确定的时间，如果有，则不进行处理.
        for i in range(0, 2):
            if self.tp.tunit[i] != -1:
                return cur
        # 获取当前是在周几，如果识别到的时间小于当前时间，则识别时间为下一周
        tmp = arrow.get(self.normalizer.timeBase, "YYYY-M-D-H-m-s")
        curWeekday = tmp.weekday()
        if curWeekday > weekday:
            cur = cur.shift(days=7)
        return cur

    def preferFuture(self, checkTimeIndex):
        """
        如果用户选项是倾向于未来时间，检查checkTimeIndex所指的时间是否是过去的时间，如果是的话，将大一级的时间设为当前时间的+1。
        如在晚上说“早上8点看书”，则识别为明天早上;
        12月31日说“3号买菜”，则识别为明年1月的3号。
        :param checkTimeIndex: _tp.tunit时间数组的下标
        :return:
        """
        # 1. 检查被检查的时间级别之前，是否没有更高级的已经确定的时间，如果有，则不进行处理.
        for i in range(0, checkTimeIndex):
            if self.tp.tunit[i] != -1:
                return
        # 2. 根据上下文补充时间
        self.checkContextTime(checkTimeIndex)
        # 3. 根据上下文补充时间后再次检查被检查的时间级别之前，是否没有更高级的已经确定的时间，如果有，则不进行倾向处理.
        for i in range(0, checkTimeIndex):
            if self.tp.tunit[i] != -1:
                return
        # 4. 确认用户选项
        if not self.normalizer.isPreferFuture:
            return
        # 5. 获取当前时间，如果识别到的时间小于当前时间，则将其上的所有级别时间设置为当前时间，并且其上一级的时间步长+1
        time_arr = self.normalizer.timeBase.split('-')
        cur = arrow.get(self.normalizer.timeBase, "YYYY-M-D-H-m-s")
        cur_unit = int(time_arr[checkTimeIndex])
        if cur_unit < self.tp.tunit[checkTimeIndex]:
            return
        # 准备增加的时间单位是被检查的时间的上一级，将上一级时间+1
        cur = self.addTime(cur, checkTimeIndex - 1)
        time_arr = cur.format("YYYY-M-D-H-m-s").split('-')
        for i in range(0, checkTimeIndex):
            self.tp.tunit[i] = int(time_arr[i])
            if i == 1:
                self.tp.tunit[i] += 1

    def checkContextTime(self, checkTimeIndex):
        """
        根据上下文时间补充时间信息
        :param checkTimeIndex:
        :return:
        """
        for i in range(0, checkTimeIndex):
            if self.tp.tunit[i] == -1 and self.tp_origin.tunit[i] != -1:
                self.tp.tunit[i] = self.tp_origin.tunit[i]
        # 在处理小时这个级别时，如果上文时间是下午的且下文没有主动声明小时级别以上的时间，则也把下文时间设为下午
        if self.isFirstTimeSolveContext is True and checkTimeIndex == 3 and self.tp_origin.tunit[
            checkTimeIndex] >= 12 and self.tp.tunit[checkTimeIndex] < 12:
            self.tp.tunit[checkTimeIndex] += 12
        self.isFirstTimeSolveContext = False

    def addTime(self, cur, fore_unit):
        if fore_unit == 0:
            cur = cur.shift(years=1)
        elif fore_unit == 1:
            cur = cur.shift(months=1)
        elif fore_unit == 2:
            cur = cur.shift(days=1)
        elif fore_unit == 3:
            cur = cur.shift(hours=1)
        elif fore_unit == 4:
            cur = cur.shift(minutes=1)
        elif fore_unit == 5:
            cur = cur.shift(seconds=1)
        return cur
