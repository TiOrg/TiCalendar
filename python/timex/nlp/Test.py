#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import re
import os
from TimeNormalizer import TimeNormalizer

tn = TimeNormalizer()

path = '/Users/simon/Desktop/TiCalendar/python/res'
files = os.listdir(path)#['2601.txt']#
for file in files:
    if file == '.DS_Store':
        continue
    if file.find('res')>=0:
        continue
    with open(path + '/' + file, "rb") as fin:
        text = fin.read().decode('utf-8')
        print('\n\n')
        print(file)
        if text:
            tn.parse(text)
            with open(path + '/' + "res_" + file, "w") as fout:
                for token in tn.timeToken:
                    fout.write(token.time.format("YYYY-MM-DD HH:mm:ss --- "))
                    event = re.sub(u'\d[\.、]','',token.sent).replace('\n','')
                    if len(event) > 150:
                        fout.write(event[:150])
                    else:
                        fout.write(event)
                    fout.write('\n')
#
# while True:
#     text = input("input a sentence:")
#     tn.parse(text)
#     print(token.time.format("YYYY-MM-DD HH:mm:ss --- "))
#
