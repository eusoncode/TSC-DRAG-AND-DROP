# TSC-DRAG-DROP-DROP

## Steps in setting up this project

### step 1
- Create a repository in your github account with a unique name
- Follow the github instruction for setting up a project
- Add the README.md file.

### step 2
- Install node globally: *npm install -g node* (for windows users)
- Install typescript globally: *npm install -g typescript* (for windows users)
- Initialize node in your project: *npm init -y*
- Initialize typescript to compile the entire project folder:  *tsc --init*
- Create a app.ts file and index.html file
- Install lite server: *npm install lite-server --save-dev* and add *"start": "lite-server"* to the script in package.json
- Create a git ignore file: .gitignore and add node_modules and *.js in the file
- Setup the index.html file using *html*, chose the html 5, then add a script to point to the app.js that i will be created when app.ts compiles.
- On another terminal, use: *tsc --w* to put Project file in watch mode
- On another terminal, use: *npm start* to launch the Project on a web browser. Use the URL address provided e.g. http://localhost:3000
- Create a *src* & *dist* folder
- Tweak tsconfig file to *outDir* option to and point to the dist folder.
- Enable the *rootDir* option and point to the src folder
- Enable the *noEmitOnError*


