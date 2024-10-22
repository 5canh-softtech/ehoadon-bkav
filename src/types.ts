// src/types.ts

export interface Config {
  partnerGUID: string;
  partnerToken: string; // Dạng "keyBase64:ivBase64"
  mode?: "prod" | "dev";
}

export interface ResponseBase {
  success: boolean;
  data?: any;
  error?: string;
}

export interface InvoiceDetail {
  ItemName: string;
  UnitName: string;
  Qty: number;
  Price: number;
  Amount: number;
  TaxRateID: number;
  TaxRate: number;
  TaxAmount: number;
  IsDiscount: boolean;
  IsIncrease: boolean | null;
  ItemTypeID: number;
}

export interface InvoiceAttachFile {
  FileName: string;
  FileExtension: string;
  FileContent: string;
}

export interface Invoice {
  InvoiceTypeID: number;
  InvoiceDate: string;
  BuyerName: string;
  BuyerTaxCode: string;
  BuyerUnitName: string;
  BuyerAddress: string;
  BuyerBankAccount: string;
  PayMethodID: number;
  ReceiveTypeID: number;
  ReceiverEmail: string;
  ReceiverMobile: string;
  ReceiverAddress: string;
  ReceiverName: string;
  Note: string;
  BillCode: string;
  CurrencyID: string;
  ExchangeRate: number;
  InvoiceForm: string;
  InvoiceSerial: string;
  InvoiceNo: number;
  OriginalInvoiceIdentify: string;
}

export interface CommandObjectCreateUpdate {
  Invoice: Invoice;
  ListInvoiceDetailsWS: InvoiceDetail[];
  ListInvoiceAttachFileWS: InvoiceAttachFile[];
  PartnerInvoiceID: number;
  PartnerInvoiceStringID: string;
}

export interface CommandDataCreateUpdate {
  CmdType: 100 | 101 | 110 | 111 | 112 | 122 | 126 | 200;
  CommandObject: CommandObjectCreateUpdate[];
}

export interface CommandObjectCancel {
  PartnerInvoiceID: number;
  PartnerInvoiceStringID: string;
}

export interface CommandDataCancel {
  CmdType: 202 | 301;
  CommandObject: CommandObjectCancel[];
}

export interface CommandDataInquiry {
  CmdType: 800 | 801 | 802 | 804 | 808 | 809 | 810 | 811 | 812 | 813;
  CommandObject: string;
}

export interface CommandDataCompany {
  CmdType: 904;
  CommandObject: string; // Mã số thuế
}

export interface CommandResult<T> {
  Status: number;
  Object: T;
  isOk: boolean;
  isError: boolean;
}

export interface InvoiceResult {
  PartnerInvoiceID: number;
  PartnerInvoiceStringID: string;
  InvoiceGUID: string;
  InvoiceForm: string;
  InvoiceSerial: string;
  InvoiceNo: number;
  MTC: string;
  Status: number;
  MessLog: string | null;
}

export interface InvoiceHistory {
  FuncId: number;
  STT: number;
  UserName: string;
  ID: number;
  CreateDate: string;
  IP: string | null;
  UserID: number;
  ObjectGUID: string;
  LogContent: string;
}

export interface CompanyInfo {
  MaSoThue: string;
  TenChinhThuc: string;
  DiaChiGiaoDichChinh: string;
  DiaChiGiaoDichPhu: string;
  TrangThaiHoatDong: string;
}

export type CommandData =
  | CommandDataCreateUpdate
  | CommandDataCancel
  | CommandDataInquiry
  | CommandDataCompany;

export interface CommandDataBase<T> {
  CmdType: number;
  CommandObject: T;
}

export type CommandObject =
  | CommandObjectCreateUpdate[]
  | CommandObjectCancel[]
  | string;

export interface CommandDataGeneral extends CommandDataBase<CommandObject> {}
