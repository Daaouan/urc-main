import { ErrorCallback, Callback, Room } from "../model/common";
import { CustomError } from "../model/CustomError";

export function getRooms(
  userId: number,
  onResult: Callback<Room[]>,
  onError: ErrorCallback
) {
  fetch("/api/rooms", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (response.ok) {
        const rooms = (await response.json()) as Room[];
        onResult(rooms);
      } else {
        const error = (await response.json()) as CustomError;
        onError(error);
      }
    })
    .catch((error) => {
      console.error(error);
      onError(new CustomError("Failed to fetch rooms."));
    });
}
