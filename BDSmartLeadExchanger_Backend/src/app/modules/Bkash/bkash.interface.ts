export type MobileBankType = 'bkash' | 'nagad' | 'rocket' | 'upay' | 'others';

export interface IMobileBank {
  type: MobileBankType; // bank type
  number: string; // account number
  rate: string; // service charge / rate
}
