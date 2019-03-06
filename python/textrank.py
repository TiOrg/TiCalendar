#-*- encoding:utf-8 -*-
from __future__ import print_function

import sys
import os
try:
    reload(sys)
    sys.setdefaultencoding('utf-8')
except:
    pass

import codecs
from textrank4zh import TextRank4Keyword, TextRank4Sentence

# text = codecs.open('../test/doc/4m3.txt', 'r', 'utf-8').read()


path = "/Users/simon/Desktop/test/python"
files = os.listdir(path)
tr4w = TextRank4Keyword()

for file in files:
    if file == '.DS_Store':
        continue
    f = open(path + "/" + file, "rb")
    text = f.read()#.encode('utf-8')

    out = open(path + "/res_" + file, "w")

    # print(text)
    print(file)
    tr4w.analyze(text=text, lower=True, window=2)   # py2中text必须是utf8编码的str或者unicode对象，py3中必须是utf8编码的bytes或者str对象

    out.write( '关键词：' )
    out.write('\n')
    for item in tr4w.get_keywords(20, word_min_len=1):
        out.write(item.word )
        out.write(str(item.weight))
        out.write('\n')

    out.write('\n')
    out.write( '关键短语：' )
    out.write('\n')
    for phrase in tr4w.get_keyphrases(keywords_num=20, min_occur_num= 2):
        out.write(phrase)
        out.write('\n')

    tr4s = TextRank4Sentence()
    tr4s.analyze(text=text, lower=True, source = 'all_filters')

    out.write('\n')
    out.write( '摘要：' )
    out.write('\n')
    for item in tr4s.get_key_sentences(num=20):
        out.write(str(item.index))
        out.write(str(item.weight) )
        out.write(item.sentence)
        out.write('\n')

    out.close()
    f.close()
