import requests

def get_github_commits():
    url = "https://github.com/sahilsk11"
    r = requests.get(url)
    text = r.text
    lines = text.split("\n")
    if "contributions" in lines[966]:
        return lines[966].replace("contributions", "").replace(" ", "").replace("\t", "")
    else:
        for i in range (len(lines)):
            if "in the last year" in lines[i]:
                return lines[i-1].replace("contributions", "").replace(" ", "").replace("\t", "")
