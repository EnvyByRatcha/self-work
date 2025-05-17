import { SparePartUnit } from "./ISparePart";

export interface TechnicianIssuedFormData {
  transitionType: string;
  technicianId: string;
  spareParts: SparePartWithUnits[];
}

export interface SparePartWithUnits {
  _id: string;
  name: string;
  sparePartUnits: SparePartUnit[];
}
