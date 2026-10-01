export type NegotiationColumn = "buyer" | "seller" | "policy";

export type NegotiationEventType =
  | "offer"
  | "counter"
  | "check"
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
    buyerMaxBudget: number;
    sellerFloorPerUnit: number;
    maxRounds: number;
  };
  events: NegotiationEvent[];
}
