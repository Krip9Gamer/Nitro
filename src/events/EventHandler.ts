import EventPacket from "../network/discord/packets/EventPacket.ts";
import Payload from "../network/discord/interfaces/Payload.ts";
import Message from "../structures/Message.ts";
import User from "../structures/User.ts";
import Client from "../Client.ts";
import ClientUser from "../structures/ClientUser.ts";
import Logger from "../utils/Logger.ts";

class EventHandler {
    private client: Client;
    constructor(client: Client) {
        this.client = client;
    }

    /**
     * initializes the event handler
     */
    public init() {
        
    }

    public handleEvent(pk: EventPacket): void {
        new Logger().debug('Packet prehandle: ' + pk.event);
        const name: string = pk.event;
        const funcName = 'on' + name.toLowerCase().split('_').map(e => e.charAt(0).toUpperCase() + e.substr(1)).join('');
        if ((this as any)[funcName] !== undefined) {
            (this as any)[funcName](pk.data);
            return;
        } 

    }

    /**
     * Called when the gateway calls READY
     * @param data - Ready event
     */
    public onReady(data: any): void {
        this.client.user = new ClientUser(data.user);
        //this.client.gateway.set('version', data.v);
        //this.client.dataManager.add('private_channels', []);
        //this.client.session_id = data.session_id;
        //this.client.shard = data.shard;
        this.client.emit('ready', data.session_id);
    }

    /**
     * Called when the gateway calls MESSAGE
     */
    public onMessageCreate(data: any): void {
        const message = new Message(data);
        this.client.emit('message', message);
    }
}
export default EventHandler;