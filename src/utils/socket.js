import {io} from "socket.io-client";

const socket = io("localhost:5000", {
    reconnectionDelayMax: 10000,
    auth: {
        token: "123"
    },
    query: {
        "my-key": "my-value"
    }
});

export {socket};