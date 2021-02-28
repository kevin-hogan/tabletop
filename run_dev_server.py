import os
import random
import string
import pymongo
from flask import Flask, send_from_directory, request, jsonify, redirect
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask_cors import CORS

app = Flask(__name__, static_folder="frontend/build")
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

PLAYER_POSITIONS_KEY = 'playerPositions'
BOARD_COLORS_KEY = 'boardColors'
ROOM_KEY = 'room'

db_client = pymongo.MongoClient('mongodb://localhost:27017/')
db = db_client['tabletop']
db_board_states = db['board_states']

@socketio.on('join')
def on_join(data):
    room = data[ROOM_KEY]
    join_room(room)
    board_state = db_board_states.find_one({ROOM_KEY: room})
    emit(PLAYER_POSITIONS_KEY, board_state[PLAYER_POSITIONS_KEY], room=request.sid)
    emit(BOARD_COLORS_KEY, board_state[BOARD_COLORS_KEY], room=request.sid)

@socketio.on('updatePlayerPositions')
def update_player_positions(player_position_update):
    room = player_position_update[ROOM_KEY]
    db_board_states.update_one({ROOM_KEY: room}, { "$set": { PLAYER_POSITIONS_KEY: player_position_update[PLAYER_POSITIONS_KEY]} })
    emit(PLAYER_POSITIONS_KEY, player_position_update[PLAYER_POSITIONS_KEY], room=room)

@socketio.on('updateBoardColors')
def update_board_colors(board_colors_update):
    room = board_colors_update[ROOM_KEY]
    db_board_states.update_one({ROOM_KEY: room}, { "$set": { BOARD_COLORS_KEY: board_colors_update[BOARD_COLORS_KEY]} })
    emit(BOARD_COLORS_KEY, board_colors_update[BOARD_COLORS_KEY], room=room)

@app.route('/room', methods=['POST'])
def create_room():
    room = ''.join(random.choices(string.ascii_lowercase + string.digits, k=20))
    db_board_states.insert_one({ROOM_KEY: room, PLAYER_POSITIONS_KEY: {}, BOARD_COLORS_KEY: {}})
    return jsonify({ROOM_KEY: room})


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0")