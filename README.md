# vditor for windows

Based on [aardio](www.aardio.com).

+ Development

```text
cd web.src

pnpm install

pnpm run dev

cd ..

start default.aproj && F5
```

+ Build

```text
cd web.src

pnpm run build

cd ..

start default.aproj && F7
```

## Features

Supports:

+ open file
+ save file
+ save file as
+ export to html
+ open file with command(`start "" Editor.exe {{ File Path }}`)
+ simply set up with command (`start "" Editor.exe SETUP`)

## todo

Better shell open, now using `Sleep(1000)` to  wait for the vditor's beging ready. 

