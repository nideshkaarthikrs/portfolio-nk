export type NegotiationColumn = "buyer" | "seller" | "policy";

export type NegotiationEventType =
  | "offer"
  | "counter"
  | "blocked"
  | "revised"
  | "agreement"
  | "settlement"
  | "audit";

export interface NegotiationEvent {
  id: number;
  column: NegotiationColumn;
  type: NegotiationEventType;
  actorLabel: string;
  message: string;
  amount?: string;
}

export interface NegotiationScript {
  context: {
    item: string;
    buyerSpendLimit: number;
    sellerFloor: number;
  };
  events: NegotiationEvent[];
}
