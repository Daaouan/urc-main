import { ErrorCallback, RoomsMessage} from "../../model/common";
import {CustomError} from "../../model/CustomError";

export function addMessage(message : RoomsMessage, onResult: (success: boolean) => void, onError: ErrorCallback) {  
    fetch("/api/addRoomMessages",
    {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
        .then(async (response) => { 
            if (response.ok) { 
                onResult(true);
            } else {
              const error = await response.json() as CustomError;
              onError(error);
              onResult(false); 
            }
        }, onError);
}

export function sendNotif(message : RoomsMessage, onResult: (success: boolean) => void, onError: ErrorCallback) { 

    fetch("/api/sendnotification",
    {
        method: "POST", // ou 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
        .then(async (response) => { 
            if (response.ok) { 
                onResult(true);
            } else {
              const error = await response.json() as CustomError;
              onError(error);
              onResult(false); // Signalise l'échec de la création du message
            }
        }, onError);

}

