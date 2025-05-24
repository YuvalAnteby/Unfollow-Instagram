import json
import os


def load_followers(path):
    """
    Loads users who follow you from json file
    :param path: string of a path to a followers json file
    :return: list of usernames of followers
    """
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
    """
    Loads users you follow from json file
    :param path:
    :return:
    """
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


def save_whitelist(usernames: list[str]):
    """
    Saves a whitelist.json file for users we don't care if they don't follow back
    :param usernames: list of usernames
    :return:
    """
    os.makedirs("temp_instagram_data", exist_ok=True)
    path = os.path.join("temp_instagram_data", "whitelist.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(usernames, f, indent=2)

def load_whitelist():
    path = os.path.join("temp_instagram_data", "whitelist.json")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return set(json.load(f))
    return set()

def get_general_unfollowers(following_path, followers_path):
    """
    Shows all the users who don't follow you back, using local json files provided from instagram
    :param following_path: path to a following.json file, contains the users you follow
    :param followers_path: path to a followers_1.json, contains the users following you
    :return: list of users who doesn't follow you back
    """
    followers = load_followers(followers_path)
    following = load_following(following_path)
    return set(following) - set(followers) # unfollowers

