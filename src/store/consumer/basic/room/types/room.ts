export interface updateRoomPayload {
  user_building_details_id: string;
  buildingId: string;
  title: string;

  construction: string;
  "construction-subtype": string;
  "percentage-glass": string;

  "start-hour": string;
  "end-hour": string;

  "wall-type": string;
  city: string;
  month: string;

  "percentage-MDDB": string;
  LSM: number;

  "north-wall-area": number;
  "east-wall-area": number;
  "south-wall-area": number;
  "west-wall-area": number;

  "roof-type": string;
  "roof-area": number;

  "north-fenestration-area-shaded": number;
  "north-fenestration-area-sunlit": number;
  "east-fenestration-area-shaded": number;
  "east-fenestration-area-sunlit": number;
  "south-fenestration-area-shaded": number;
  "south-fenestration-area-sunlit": number;
  "west-fenestration-area-shaded": number;
  "west-fenestration-area-sunlit": number;

  "indoor-shading": string;

  "u-value-window": number;
  "beam-solar-heat-gain-coefficient": number;
  "diffuse-solar-heat-gain-coefficient": number;
  "beam-indoor-solar-attenuation-coefficient": number;
  "diffuse-indoor-solar-attenuation-coefficient": number;

  "lighting-type": string;
  "number-lighting": number;
  "lighting-rating": number;

  "activity-type": string;
  "activity-location": string;
  "velocity-type": string;

  "occupant-capacity": number;
  "percentage-MDHR": string;

  "infiltration-rate": number;
  "fenestration-area": number;
  "floor-area": number;
}
