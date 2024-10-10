export interface ArtworkData {
  type: string;
  productInfo: ProductInfo;
  manualUploadArtwork: ManualUploadArtwork;
  designStudioArtwork: DesignStudioArtwork;
}


export interface ProductInfo {
  dpi: number,
  sides: number,
  width_px: number,
  height_px: number,
  width_mm: number,
  height_mm: number,
  bleed_mm: number
}

export interface ManualUploadArtwork {
  isActive: boolean;
  status: string; 
  files: FileData[];
}

export interface FileData {
  fileName: string;
  fileUrl: string;
  thumbUrl: string;
  sort: number;
  settings?: FileSettings;
}

export interface FileSettings {
  perforationLines: PerforationLine[];
}

export interface PerforationLine {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  thickness: number;
  dashArray: number[];
  color: string;
}

export interface DesignStudioArtwork {
  isActive: boolean;
  status: string; 
}