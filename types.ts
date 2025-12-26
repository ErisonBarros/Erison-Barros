export enum PropertyType {
  TERRENO = 'Terreno',
  CASA = 'Casa',
  APTO = 'Cond/Apto',
  COMERCIAL = 'Comercial'
}

export enum QuadraStatus {
  ESQUINA = 'Esquina',
  MEIO = 'Meio de quadra',
  FUNDOS = 'Fundos'
}

export enum Topography {
  PLANO = 'Plano ao nível',
  ACIMA = 'Acima do nível',
  ABAIXO = 'Abaixo do nível',
  ACIDENTADO = 'Acidentado/Inclinado'
}

export enum Pavement {
  SOLO = 'Solo',
  PARALELEPIPEDO = 'Paralelepípedo',
  ASFALTO = 'Asfalto'
}

export enum Coverage {
  LAJE = 'Laje',
  TELHADO = 'Telhado',
  OUTRO = 'Outro'
}

export interface PropertyData {
  type: PropertyType;
  price: string;
  phone: string;
  informantName: string;
  lotArea: string;
  builtArea: string;
  frontage: string; // Testada
  condoFee: string;
  quadraStatus: QuadraStatus | '';
  topography: Topography | '';
  floors: string; // "Térreo" or "Andares" (could be boolean or string specific)
  pavement: Pavement | '';
  hasPool: 'Sim' | 'Não' | '';
  isWalled: 'Sim' | 'Não' | ''; // For Terreno
  coverage: Coverage | '';
  latitude: number | null;
  longitude: number | null;
  photos: File[];
}