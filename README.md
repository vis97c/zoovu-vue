# Zoovu game Vue.js

Mini game built in vue for zoovo.

[Github repo](https://github.com/vis97c/zoovu-vue) - [Live preview](https://zoovu-vue.surge.sh/)

While this was a fun project, it take a while to complete because i wanted to developt it in [React.js](https://github.com/vis97c/zoovu-react-typescript) too. I hope it is of your liking. Also i just write a couple of test because in not that experienced in that part, i'll work a lot to improve that part.

To developt the project quickly i used a modified version of the custom css library that i was developing for a personal project.

## development

Install the node dependencies.

```bash
    yarn
    #Or
    npm install
```

Then build the project, thats all.

```bash
    yarn dev
    #Or
    npm run dev
```

While "**watch**" mode is available, i recommend to run the dev command at least once to copy the static assets to the "**public**" directory 

Also while developing you can optionally provide the enviroment variable "WATCH_BROWSER" to open a different browser than the system default

The source files will be available at "**src**" directory

## deployment

This project is hosted on surge

```bash
    yarn deploy
    #Or
    npm run deploy
```

Optionally you can run the "**build**" command to generate the required assets to deploy in other enviroment