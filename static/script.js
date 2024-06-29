document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const progress = document.querySelector("#progress");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const url = form.querySelector("input[name='url']").value;
        progress.innerHTML = "Download started...";
        
        fetch("/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `url=${encodeURIComponent(url)}`,
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'video.mp4';  // Adjust the filename and extension if needed
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            progress.innerHTML = "Download completed!";
        })
        .catch(error => {
            console.error("Error:", error);
            progress.innerHTML = "Error starting download.";
        });
    });
});
