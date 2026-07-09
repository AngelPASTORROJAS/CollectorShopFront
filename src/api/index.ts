import { AuthResource } from "./ressources/AuthRessources";
import { ItemsResource } from "./ressources/ItemsRessource";
import { ChatResource } from "./ressources/ChatResource";

interface CollectorApiType {
  auth: AuthResource;
  items: ItemsResource;
  chat: ChatResource;
}

export const collectorAPI: CollectorApiType = {
  auth: new AuthResource(),
  items: new ItemsResource(),
  chat: new ChatResource(),
};
