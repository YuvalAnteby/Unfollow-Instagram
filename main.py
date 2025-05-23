import json

def load_followers(path):
    # Get the json file
    with open(path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    usernames = []
    # Move the info to a list
    for entry in data:
        if "string_list_data" in entry:
            for string_list in entry["string_list_data"]:
                usernames.append(string_list["value"])
    return usernames

def load_following(path):
    # Get the json file
    with open(path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    # Access the nested "relationships_following" key
    entries = data.get("relationships_following", [])
    usernames = []
    for entry in entries:
        if "string_list_data" in entry:
            for string_list in entry["string_list_data"]:
                usernames.append(string_list["value"])
    return usernames

def show_general_unfollowers():
    print("\nGENERAL UNFOLLOWERS:\n\n")
    followers = load_followers('followers_1.json')
    following = load_following('following.json')
    unfollowers = set(following) - set(followers)
    for unfollower in sorted(unfollowers):
        print(unfollower)

def show_menu():
    choice = 0
    while choice != 2:
        print("\nMENU:\n")
        choice = input("1. Show unfollowers\n2. Exit\n")
        if choice == "1":
            show_general_unfollowers()
        if choice == "2":
            exit()

show_menu()
