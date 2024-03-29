import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URI : process.env.REACT_APP_DEV_API_URI;

console.log(URL)

export const socket = io(URL, {
    autoConnect: false,
    transports: ['websocket', 'polling', 'flashsocket']
});