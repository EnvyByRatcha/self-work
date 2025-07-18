export interface InventoryTransition {
  _id: string;
  transitionType: string;
  userId: string;
  from: string;
  to: string;
  cost: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransitionFormData {
  transitionType: string;
  technicianId?: string;
  customerId?: string;
}

export interface InventoryTransitionDetail {
  _id: string;
  name: string;
  qty: number;
  cost: number;
  total: number;
}

export interface InventoryTransitionDetailFormData {
  type: "product" | "sparepart";
  productId?: string;
  sparePartId?: string;
  productUnitId?: string;
  sparePartUnitId?: string;
  serialNumber?: string;
  qty: number;
  cost: number;
}

export interface TransitionFormData {
  transition: InventoryTransitionFormData;
  details: InventoryTransitionDetailFormData[];
}
