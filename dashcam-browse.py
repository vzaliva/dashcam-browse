#!/usr/bin/env python3

import xmltodict
import requests
import json
from bottle import route, run, template, request, response, static_file

# `property` must be "Normal" or "Event"
# ?backward=1&count=30&property=Normal&from=0&action=dir&format=all
@route('/list')
def list():
    if debug:
        f = open("sample_list.xml", "r") 
        xml = f.read()
        f.close()
    else:
        r = requests.get("%scgi-bin/Config.cgi?%s" %
                         (config['CAMERA']['URL'],request.query_string))
        assert r.status_code == 200, "HTTP error %d" % r.status_code
        assert r.headers["Content-Type"] == "application/xml"
        xml = r.content
    response.headers['Content-Type'] = 'application/json'
    return json.dumps(xmltodict.parse(xml))

@route('/')
def index():
    return static_file('index.html',root='.')

@route('/scripts.js')
def index():
    return static_file('scripts.js', root='.')

def main():
    import argparse, configparser
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--config", default='dashcam.cfg', help="config file")
    parser.add_argument("-d", '--debug', action='store_true')
    args = parser.parse_args()
    global debug
    debug = args.debug
    global config
    config = configparser.ConfigParser()
    config.read(args.config)
    run(host=config['WEB']['host'], port=config['WEB']['port'])

main()


