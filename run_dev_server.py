import os
from flask import Flask, send_from_directory
from flask_socketio import SocketIO, send, emit

app = Flask(__name__, static_folder="frontend/build")
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

gameState = { "bard": { "row": 0, "col": 0 } }

@socketio.on('connect')
def on_connect():
    emit('gameState', gameState)

@socketio.on('updateGameState')
def update_game_state(state_update):
    gameState["bard"] = state_update["bard"]
    emit('gameState', gameState, broadcast=True)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", debug=True)