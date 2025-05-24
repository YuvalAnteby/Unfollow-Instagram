from src.json_processor import get_general_unfollowers

# followers_path = "../followers_1.json"  # default - in project root folder
# following_path = "../following.json"  # default - in project root folder
followers_path = input("Enter full path to followers_1.json file: ")
following_path = input("Enter full path to following.json file: ")
# Get and print the users who don't follow back
unfollowers = get_general_unfollowers(following_path, followers_path)
print("\nUNFOLLOWERS:\n\n")
for unfollower in sorted(unfollowers):
    print(unfollower)
