import os
from tkinter import *
from tkinter import filedialog, messagebox
import zipfile

from src.json_processor import get_general_unfollowers


def btn_click():
    paths = select_files()
    if paths and "followers_1" in paths and "following" in paths:
        unfollowers = get_general_unfollowers(paths["following"], paths["followers_1"])
        result_box.delete(1.0, END)
        if unfollowers:
            result_box.insert(END, "\n".join(unfollowers))
        else:
            result_box.insert(END, "No unfollowers!")



def select_files():
    file_data = {}
    file_paths = filedialog.askopenfilenames(
        title="Select followers_1.json and following.json files",
        filetypes=[]
    )
    if len(file_paths) == 1 and "instagram" in file_paths[0] and file_paths[0].endswith('.zip'):
        file_data['zip_file'] = file_paths[0]
        file_label.config(text=f"Selected ZIP file:\n{file_paths[0]}")
        return handle_zip(file_paths[0])

    elif len(file_paths) == 2:
        file_data['followers_1'] = file_paths[0]
        file_data['following'] = file_paths[1]
        return file_data
    else:
        messagebox.showerror("Invalid Selection",
                             "Please select either exactly 2 files (followers and following) or 1 .zip file.")


def handle_zip(zip_path):
    """
    Checks whether the given ZIP file contains the expected Instagram data structure:
    connections/followers_and_following/ with two files inside (followers and following).

    :param zip_path: Path to the Instagram ZIP file.
    :return: dict with keys 'followers' and 'following' containing the internal ZIP paths if found, else None.
    """
    expected_folder = "connections/followers_and_following/"
    found_files = {"followers_1": None, "following": None}
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            for name in zip_ref.namelist():
                if name.startswith(expected_folder):
                    if "followers_1.json" in name:
                        found_files["followers_1"] = name
                    elif "following.json" in name:
                        found_files["following"] = name
            if found_files["followers_1"] and found_files["following"]:
                # Extract to a temp dir
                extract_dir = os.path.join(os.getcwd(), "temp_instagram_data")
                zip_ref.extract(found_files["followers_1"], extract_dir)
                zip_ref.extract(found_files["following"], extract_dir)
                followers_path = os.path.join(extract_dir, found_files["followers_1"])
                following_path = os.path.join(extract_dir, found_files["following"])
                print("Followers path:", followers_path)
                print("Following path:", following_path)
                return {"followers_1": followers_path, "following": following_path}
            else:
                return None

    except zipfile.BadZipFile:
        return None


# Initialize the root window
root = Tk()
root.title("Unfollowers")
root.geometry("600x600")
# Button for followers
btn_selector = Button(root, text="Select file", command=btn_click)
btn_selector.pack(pady=10)
# Label to show selected file(s)
file_label = Label(root, text="No file(s) selected", wraplength=500, justify=LEFT)
file_label.pack()

# Result box with scrollbar
result_frame = Frame(root)
result_frame.pack(pady=10, fill=BOTH, expand=True)

scrollbar = Scrollbar(result_frame)
scrollbar.pack(side=RIGHT, fill=Y)

result_box = Text(result_frame, wrap=WORD, yscrollcommand=scrollbar.set)
result_box.pack(side=LEFT, fill=BOTH, expand=True)

scrollbar.config(command=result_box.yview)

# Run the GUI loop
root.mainloop()
