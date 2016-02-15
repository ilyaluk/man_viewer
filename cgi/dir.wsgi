def application(environ, start_response):
	import json
	import os

	rootDir = '/srv/http/man/mans'
	res = {}
	for dirName, subdirList, fileList in os.walk(rootDir):
		tmp = []
		for fname in fileList:
			tmp.append(fname)
		res[dirName.split('/')[-1]] = tmp[:]

	for i in res:
		res[i].sort(key=lambda s: s.lower())
	
	status = '200 OK'
	output = bytes(json.dumps(res, separators=(',', ':')), 'ascii')

	response_headers = [('Content-type', 'application/json'),
						('Content-Length', str(len(output)))]
	start_response(status, response_headers)

	return [output]
