import { AuthResource } from "./ressources/AuthRessources";
import { ItemsResource } from "./ressources/ItemsRessource";

interface CollectorApiType {
  auth: AuthResource;
  items: ItemsResource;
}

export const collectorAPI: CollectorApiType = {
  auth: new AuthResource(),
  items: new ItemsResource(), // À implémenter sur le même modèle
};
