import sys

if (len(sys.argv) > 1):
    # TODO: Print message to display
    print('{"code":200,"message":"Message received","data":"' + sys.argv[1] + '"}')
else:
    print('{"code":400,"message":"No message received","data":null}')
