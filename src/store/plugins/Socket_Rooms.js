const socketPlugin = socket => store => {
    socket.on('rooms', data => {
        store.commit(`pullRooms`, data.sort((a, b) => a.id - b.id));
    });

    store.subscribe(mutation => {
        if (mutation.type === `openRoomSocket`) {
            socket.open();
            socket.emit('getRooms');
        } else if (mutation.type === `closeRoomSocket`) {
            socket.close();
        } else if (mutation.type === `newRoom`) {
            socket.emit('setRoom', mutation.payload);
        }
    });
};

export default socketPlugin;
