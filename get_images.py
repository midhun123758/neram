import urllib.request
import re

try:
    req = urllib.request.Request(
        'https://izanami-official.com/', 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = set(re.findall(r'https?://[^\s"\'\)]+\.(?:jpg|jpeg|png|webp|gif)', html))
    if not images:
        images = set(re.findall(r'/[^\s"\'\)]+\.(?:jpg|jpeg|png|webp|gif)', html))
        images = ['https://izanami-official.com' + img if not img.startswith('http') else img for img in images]
    
    print("Images found:")
    for img in images:
        print(img)
except Exception as e:
    print("Error:", e)
