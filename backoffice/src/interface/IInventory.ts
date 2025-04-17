export interface InventoryTransitions {
  _id: string;
  transitionType: string;
  userId: string;
  from: string;
  to: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransitionFormData {
  transitionType: string;
  from: string;
  to: string;
}

export interface InventoryTransitionDetail {
  _id: string;
  transitionId: string;
  itemType: string;
  qty: number;
  cost: number;
}

export interface InventoryTransitionDetailFormData {
  type: "product" | "sparepart";
  productId: string;
  sparePartId: string;
  qty: number;
  cost: number;
}
