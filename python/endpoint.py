import flask
import spider
import flask_cors


app = flask.Flask(__name__)
flask_cors.CORS(app)


@app.route('/')
def healthcheck():
    return "python service is up and running"


@app.route('/helloworld')
def hello():
    return "hello world"


@app.route('/gitCommits')
def git_commits():
    return {"code": 200, "commits": spider.get_github_commits()}


if __name__ == "__main__":
    app.run(debug=True)
