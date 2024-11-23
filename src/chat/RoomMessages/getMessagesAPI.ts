import { ErrorCallback,  Message, MessageInfos} from "../../model/common";
import {CustomError} from "../../model/CustomError";

export function getMessagesByRoom(roomId: number, onResult: (messages: Message[]) => void, onError: ErrorCallback) {
    fetch(`/api/getRoomMessages/${roomId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(async (response) => {
            if (response.ok) {
                const messages: Message[] = await response.json();
                onResult(messages);
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        }, onError);
}
