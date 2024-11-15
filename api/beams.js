import {getConnecterUser, triggerNotConnected} from "../lib/session.js";
import PushNotifications from "@pusher/push-notifications-server"


export default async (req, res) => {

   const userIDInQueryParam = req.query["user_id"];
    const user = await getConnecterUser(req);
    console.log("PushToken : " + userIDInQueryParam + " -> " + JSON.stringify(user) + "external user id : " + user.externalId);
    if (user === undefined || user === null || userIDInQueryParam !== user.externalId) {
        console.log("Not connected");
        triggerNotConnected(res);
        return;
    }

    console.log("Using push instance : " + "d119df2c-f7bd-4788-9562-9bd8ed920f5c");
    const beamsClient = new PushNotifications({
        instanceId: "d119df2c-f7bd-4788-9562-9bd8ed920f5c",
        secretKey: "011FE802D12636A89CD615C3B68C0E8C524F592E1420DB909FB8F68E670A4CC2",
        
    });

    const beamsToken = beamsClient.generateToken(user.externalId);

    console.log(JSON.stringify(beamsToken));
    res.send(beamsToken);

}






