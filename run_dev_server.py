import os
from flask import Flask, send_from_directory
from flask_socketio import SocketIO, send, emit

app = Flask(__name__, static_folder="frontend/build")
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

player_positions = {}
board_colors = {}

@socketio.on('connect')
def on_connect():
    emit('playerPositions', player_positions)
    emit('boardColors', board_colors)

@socketio.on('updatePlayerPositions')
def update_game_state(player_position_update):
    global player_positions
    player_positions = {**player_positions, **player_position_update}
    emit('playerPositions', player_positions, broadcast=True)

@socketio.on('updateBoardColors')
def update_board_colors(board_colors_update):
    global board_colors
    board_colors = {**board_colors, **board_colors_update}
    emit('boardColors', board_colors, broadcast=True)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0")