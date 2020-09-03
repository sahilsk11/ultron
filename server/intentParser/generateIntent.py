"""
CLI script used to generate a new intent
"""
intent_name = input("Enter the intent name (lowerCamelCase): ")

last_in = None
print("Enter sample utterances, and enter -1 when done.")
utterances = []
while last_in != "-1":
  last_in = input("> ")
  if last_in != "-1":
    utterances.append(last_in)

f = open("sampleIntent.js")
file_contents = f.read()
f.close()

file_contents = file_contents.replace("sampleIntent", intent_name)
upper_camel = intent_name[0].upper() + intent_name[1:]

file_contents = file_contents.replace("SampleIntent", upper_camel)
file_contents = file_contents.replace("[]", str(utterances))

f = open("./intents/"+intent_name+".js", "w")
f.write(file_contents)
f.close()
print("File successfully generated in intents/" + intent_name+".js. Happy hacking!")
