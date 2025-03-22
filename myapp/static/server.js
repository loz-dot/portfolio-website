const WebSocket = require("ws");
const { exec } = require("child_process");
const express = require("express");
const path = require("path");
const http = require("http");
const pty = require("node-pty");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/ws" });

let gameProgress = false;
let inactivityTimeout;
const TIMEOUT_MS = 2000;

// const allowedCommands = ["pip install dino_run_run_run", "dino_run_run_run", "cd", "ls", "echo"];

wss.on("connection", (ws) => {
    ws.send("Connected to the restricted shell.");
    ws.send("Enter a command: ");

    ws.on("message", (message) => {
        const command = message.toString().trim();

        if (command === "dino_run_run_run") {
            // ✅ Create a real PTY session
            gameProgress = true;
            const terminal = pty.spawn("python3", ["dinosaur.py"], {
                name: "linux",
                cols: 80,
                rows: 24,
                cwd: process.cwd(),
                env: process.env
            });

            let outputBuffer = "";
            let sending = false;

            // ✅ Send game output to WebSocket
            terminal.on("data", (data) => {
                outputBuffer += data;  // Append data to buffer

                if (!sending) {
                    sending = true;
                    setTimeout(() => {
                        ws.send(outputBuffer);
                        outputBuffer = "";
                        sending = false;
                    }, 5);  // Adjust delay for efficiency
                }

                resetTimer()
            });

            // ✅ Handle user input from WebSocket
            ws.on("message", (message) => {
                terminal.write(" ");
            });

            function resetTimer() {
                clearTimeout(inactivityTimeout);
                inactivityTimeout = setTimeout(() => {
                    console.log("Terminal inactive, killing process...");
                    terminal.kill();
                    gameProgress = false;
                    ws.send("finished")
                }, TIMEOUT_MS);
            }
        } else {

        // Validate if command is allowed
        // if (!allowedCommands.some(cmd => command.startsWith(cmd))) {
        //     ws.send("Error: Command not allowed.\n");
        //     return;
        // }
            if (!gameProgress) {
            // Execute allowed command
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        ws.send("Error: ${stderr}\n");
                    } else {
                        ws.send(stdout || "Command executed.\n");
                    }
                });
            }
        }
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dino.html"));
});

server.listen(8000, () => {
    console.log("WebSocket server running on port 8000");
}); 