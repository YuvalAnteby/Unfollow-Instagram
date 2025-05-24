import os
from tkinter import *
from tkinter import filedialog, messagebox
import zipfile

from src.json_processor import get_general_unfollowers, save_whitelist, load_whitelist


def btn_click():
    """
    Handle click event, searches for unfollowers and updated the text box
    :return:
    """
    paths = select_files()
    if paths and "followers_1" in paths and "following" in paths:
        unfollowers = get_general_unfollowers(paths["following"], paths["followers_1"])
        whitelisted = load_whitelist()
        filtered = [u for u in unfollowers if u not in whitelisted]
        result_box.config(state=NORMAL)
        result_box.delete(1.0, END)
        if filtered:
            result_box.insert(END, "\n".join(filtered))
        else:
            result_box.insert(END, "No unfollowers!")
        result_box.config(state=DISABLED)


def select_files():
    """
    Handles selection of .zip file or 2 .json files, should contain the files followers_1.json and following.json.
    If needed will create temp files outside the zip file with the .json files.
    :return: paths to the 2 files,
    """
    file_data = {}
    file_paths = filedialog.askopenfilenames(
        title="Select followers_1.json and following.json files",
        filetypes=[]
    )
    if len(file_paths) == 1 and "instagram" in file_paths[0] and file_paths[0].endswith('.zip'):
        file_data['zip_file'] = file_paths[0]
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
                return {"followers_1": followers_path, "following": following_path}
            else:
                return None

    except zipfile.BadZipFile:
        return None


def open_whitelist_window():
    """
    Opens a dialog window to let the user enter whitelisted usernames, saves the whitelist locally
    :return:
    """
    win = Toplevel(root)
    win.title("Edit Whitelist")
    win.geometry("400x300")
    Label(win, text="Enter usernames to whitelist (comma-separated or one per line):").pack(pady=5)
    input_box = Text(win, height=10, width=40)
    input_box.pack(padx=10, pady=5)
    # Load previous input of whitelist
    whitelist = load_whitelist()
    if whitelist:
        input_box.insert(END, "\n".join(sorted(whitelist)))
    # Managed saving to the whitelist file
    def save_and_close():
        raw = input_box.get("1.0", END)
        usernames = [u.strip() for u in raw.replace(",", "\n").splitlines() if u.strip()]
        save_whitelist(usernames)
        win.destroy()
        messagebox.showinfo("Whitelist Saved", f"Saved {len(usernames)} usernames to whitelist.")
    Button(win, text="Save", command=save_and_close).pack(pady=10)
    Button(win, text="Cancel", command=win.destroy).pack(pady=10)


# Initialize the root window
root = Tk()
root.title("Unfollowers")
root.geometry("600x600")
# Button for followers
btn_selector = Button(root, text="Select file", command=btn_click)
btn_selector.pack(pady=10)
# Button for whitelist
btn_whitelist = Button(root, text="Edit Whitelist", command=open_whitelist_window)
btn_whitelist.pack(pady=5)

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
