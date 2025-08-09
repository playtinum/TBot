// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function showLoading() {
	$("#backdrop").show();
}

function hideLoading() {
	$("#backdrop").hide();
}

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/realTimeLog")
    .build();

connection.on("SendLogAsObject", (log) => {
    const logContent = document.getElementById("log-content");
    const latestLog = document.getElementById("latest-log");

    const logEntry = document.createElement("div");
    logEntry.classList.add("log-entry");
    logEntry.textContent = `[${log.timestamp}] [${log.level}] [${log.LogSender}] ${log.message}`;

    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;

    latestLog.textContent = logEntry.textContent;
});

function toggleLogViewer() {
    const logContent = document.getElementById("log-content");
    const logViewer = document.getElementById("log-viewer");

    if (logContent.style.display === "none" || logContent.style.display === "") {
        logContent.style.display = "block";
        logViewer.classList.add("expanded");
    } else {
        logContent.style.display = "none";
        logViewer.classList.remove("expanded");
    }
}

connection.start().catch(err => console.error(err.toString()));
