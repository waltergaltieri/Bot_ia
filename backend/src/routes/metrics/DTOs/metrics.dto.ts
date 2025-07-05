export interface MetricsDTO {
  id: string;
  name: string;
  value: number;
  timestamp: string;
  companyId: string;
}

export interface MetricsRequestDTO {
  companyId?: string;
  startDate?: string;
  endDate?: string;
}

export interface MetricsResponseDTO {
  metrics: MetricsDTO[];
  total: number;
}
