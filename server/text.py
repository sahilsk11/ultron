import requests

resp = requests.post('https://textbelt.com/text', {
  'phone': '4088870718',
  'message': 'Hello world',
  'key': '11b5759af7ef20c1098244ed26d6d5bdcc8279b4GHSpxtgWlHWqWb6Il4Lskuy0J',
  'replyWebhookUrl': 'https://api.sahilkapur.com/handleSmsReply'
})
print(resp.json())
