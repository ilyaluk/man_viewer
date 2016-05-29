import json
import os

rootDir = 'mans'
res = {}
for dirName, subdirList, fileList in os.walk(rootDir):
	tmp = []
	for fname in fileList:
		tmp.append(fname)
	res[dirName.split('/')[-1]] = tmp[:]

for i in res:
	res[i].sort(key=lambda s: s.lower())

output = json.dumps(res, separators=(',', ':'))
open('pages.json', 'w').write(output)

res2 = []
for i in res:
	res2 += res[i]

output2 = json.dumps(res2, separators=(',', ':'))
open('pages_search.json', 'w').write(output2)
