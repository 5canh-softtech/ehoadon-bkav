// src/types.ts

/**
 * Cấu hình cho thư viện
 */
export interface Config {
  partnerGUID: string;
  partnerToken: string; // Dạng "keyBase64:ivBase64"
  mode?: "prod" | "dev";
}

/**
 * Phản hồi từ thư viện
 */
export interface ResponseBase {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Thông tin tệp đính kèm
 */
export interface Attachment {
  FileName: string; // Tên tệp
  FileContent: string; // Nội dung tệp được mã hóa Base64
  FileType: string; // Loại tệp (ví dụ: "image/png", "application/pdf")
}

/**
 * CommandObject cho lệnh tạo hóa đơn
 */
export interface CreateInvoiceCommandObject {
  Invoice: {
    InvoiceTypeID: number;
    InvoiceDate: string;
    BuyerName: string;
    BuyerTaxCode: string;
    BuyerUnitName: string;
    BuyerAddress: string;
    BuyerBankAccount?: string;
    PayMethodID: number;
    ReceiveTypeID: number;
    ReceiverEmail: string;
    ReceiverMobile: string;
    ReceiverAddress: string;
    ReceiverName: string;
    Note?: string;
    BillCode: string;
    CurrencyID: string;
    ExchangeRate: number;
    InvoiceStatusID: number;
    SignedDate: string;
  };
  ListInvoiceDetailsWS: Array<{
    ItemName: string;
    UnitName: string;
    Qty: number;
    Price: number;
    Amount: number;
    TaxRateID: number;
    TaxAmount: number;
    IsDiscount: boolean;
    IsIncrease: null | boolean;
  }>;
  PartnerInvoiceStringID: string;
  ListInvoiceAttachFileWS?: Attachment[]; // Danh sách tệp đính kèm, không bắt buộc
}

/**
 * Union type cho các CommandObject hỗ trợ (chỉ CreateInvoice trong phiên bản này)
 */
export type CommandObject = CreateInvoiceCommandObject;

/**
 * Dữ liệu cho các lệnh
 */
export interface CommandData {
  CmdType: number;
  CommandObject: CommandObject[];
}
