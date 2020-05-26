#!/usr/bin/env python3

import configparser
import argparse
import xml.etree.ElementTree as ET

import requests
from bottle import route, run, template

config = configparser.ConfigParser()

# `ftype` must be "Normal" or "Event"
def fetch_list(ftype, start=0, count=100,backward=0):
    r = requests.get("{base}cgi-bin/Config.cgi?backward={backward}&count={count}&property={ftype}&from={xfrom}&action=dir&format=all".format(
        backward=backward,
        xfrom=start,
        count=count,
        base=config['CAMERA']['URL'],
        ftype=ftype
    ))
    assert r.status_code == 200, "HTTP error %d" % r.status_code
    assert r.headers["Content-Type"] == "application/xml"
    response_body_as_xml = ET.fromstring(r.content)
    xml_tree = ET.ElementTree(response_body_as_xml)
    root = xml_tree.getroot()
    assert root.tag == ftype, "unexpected root tag '%s'" % root.tag
    return []

@route('/')
def index():
    l = fetch_list("Normal")
    return '<b>Hello1</b>!'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--config", default='dashcam.cfg', help="config file")
    args = parser.parse_args()
    config.read(args.config)
    run(host=config['WEB']['host'], port=config['WEB']['port'])

main()


