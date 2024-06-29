from flask import Flask, render_template, request, send_file
import os
import tempfile
import youtube_dl

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    url = request.form['url']
    with tempfile.TemporaryDirectory() as temp_dir:
        ydl_opts = {
            'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
        }
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            video_title = info_dict.get('title', None)
            video_extension = info_dict.get('ext', None)
            filename = f"{video_title}.{video_extension}"
            ydl.download([url])

        return send_file(
            os.path.join(temp_dir, filename),
            as_attachment=True,
            attachment_filename=filename
        )

if __name__ == "__main__":
    app.run(debug=True)
