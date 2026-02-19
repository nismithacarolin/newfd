# How to Collaborate with a Friend using GitHub

To work together on this project, follow these 4 simple steps.

## Step 1: Add your Friend as a Collaborator
1. Go to your GitHub repository page: [https://github.com/nismithacarolin/newfd](https://github.com/nismithacarolin/newfd)
2. Click **Settings** (top right tab).
3. Click **Collaborators** (left menu).
4. Click **Add people** and enter your friend's GitHub username or email.
5. Your friend will receive an email invitation to accept.

## Step 2: Your Friend Gets the Code (First Time Only)
Your friend needs to download ("clone") the project to their computer.
1. They should open a terminal/command prompt.
2. Run this command:
   ```bash
   git clone https://github.com/nismithacarolin/newfd.git
   ```
3. Now they have the project on their computer!

## Step 3: Daily Workflow (The "Loop")
Whenever you or your friend start working, follow this **exact order**:

### 1. PULL (Get Updates)
**Always do this first** before editing anything. This downloads the latest changes from the other person.
```bash
git pull origin main
```

### 2. WORK
Make your changes to the files (add features, fix bugs, etc.).

### 3. ADD & COMMIT (Save Changes)
When you are done, save your changes to Git locally.
```bash
git add .
git commit -m "Describe what you changed here"
```

### 4. PUSH (Send to GitHub)
Upload your changes so your friend can see them.
```bash
git push origin main
```

## Important Note on Data & Images
- **Code:** HTML, CSS, JS files merge easily.
- **Database (`.db` files):** Since we are using a local database file, Git cannot merge changes inside it. If you both add data at the same time, the last person to `push` will overwrite the other's database. **Try not to edit data (add faculty/students) at the exact same time.**
- **Images:** Uploaded images will be shared if you `add`, `commit`, and `push` them.
