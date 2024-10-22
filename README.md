# ehoadon-bkav

## Mô Tả

`ehoadon-bkav` là một thư viện NPM đơn giản giúp tương tác với **Bkav eHoaDon WebService**. Thư viện hỗ trợ tạo hóa đơn điện tử với khả năng đính kèm các tập tin (attachments), phù hợp cho các doanh nghiệp cần tích hợp hệ thống quản lý hóa đơn vào ứng dụng của mình.

### Tính Năng Chính

- **Tạo Hóa Đơn:** Tạo hóa đơn điện tử với đầy đủ thông tin khách hàng, dịch vụ và các tệp đính kèm.
- **Hỗ Trợ Đính Kèm Tệp:** Đính kèm các tập tin như PDF, hình ảnh vào hóa đơn.
- **Cấu Hình Linh Hoạt:** Hỗ trợ cấu hình cho chế độ sản xuất (`prod`) và phát triển (`dev`).
- **Bảo Mật:** Sử dụng mã hóa AES-256-CBC để bảo vệ dữ liệu truyền tải.

## Cài Đặt

Bạn có thể cài đặt thư viện này thông qua **npm** hoặc **yarn**:

```bash
npm install ehoadon-bkav
```

```bash
yarn install ehoadon-bkav
```

## Cấu Hình

Trước khi sử dụng thư viện, bạn cần cấu hình các thông số cần thiết như partnerGUID và partnerToken. Đảm bảo rằng bạn đã có các thông tin này từ Bkav eHoaDon.

```bash
import { Config } from 'ehoadon-bkav';

const config: Config = {
  partnerGUID: 'YOUR_PARTNER_GUID',
  partnerToken: 'YOUR_KEY_BASE64:YOUR_IV_BASE64',
  mode: 'dev', // hoặc 'prod' cho chế độ sản xuất
};
```

### Mô Tả Các Trường Cấu Hình

- **partnerGUID:** Mã định danh đối tác cung cấp bởi Bkav eHoaDon.
- **partnerToken:** Chuỗi token bao gồm keyBase64 và ivBase64, được phân cách bởi dấu hai chấm (:).
- **mode:** Chế độ hoạt động của thư viện, có thể là 'prod' (sản xuất) hoặc 'dev' (phát triển). Mặc định là 'dev'.

## Sử Dụng

### Tạo Hóa Đơn

Dưới đây là cách sử dụng phương thức createInvoice để tạo hóa đơn điện tử với các tệp đính kèm.

```bash
import { createInvoice, Config, CommandData, CreateInvoiceCommandObject, Attachment } from 'ehoadon-bkav';
import fs from 'fs';
import path from 'path';

// Cấu hình thư viện
const config: Config = {
  partnerGUID: 'YOUR_PARTNER_GUID',
  partnerToken: 'YOUR_KEY_BASE64:YOUR_IV_BASE64',
  mode: 'dev', // hoặc 'prod'
};

// Hàm đọc tệp và chuyển đổi nội dung sang Base64
function readFileAsBase64(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString('base64');
}

// Tạo danh sách các tệp đính kèm (nếu có)
const attachments: Attachment[] = [
  {
    FileName: 'invoice.pdf',
    FileContent: readFileAsBase64(path.join(__dirname, 'invoice.pdf')),
    FileType: 'application/pdf',
  },
  // Thêm các tệp khác nếu cần
];

// Dữ liệu tạo hóa đơn
const createCommandObject: CreateInvoiceCommandObject = {
  Invoice: {
    InvoiceTypeID: 1, // Hóa đơn giá trị gia tăng
    InvoiceDate: new Date().toISOString(),
    BuyerName: "Nguyen Van A",
    BuyerTaxCode: "0123456789",
    BuyerUnitName: "CONG TY ABC",
    BuyerAddress: "So 123, Duong ABC, Q. Hai Ba Trung",
    BuyerBankAccount: "",
    PayMethodID: 2, // 2 - Chuyển khoản
    ReceiveTypeID: 1, // 1 - Email
    ReceiverEmail: "testABC@gmail.com",
    ReceiverMobile: "0909111111",
    ReceiverAddress: "So 123, Duong ABC, Q. Hai Ba Trung",
    ReceiverName: "Nguyen Van A",
    Note: "Test eHoaDon",
    BillCode: "UYU150294",
    CurrencyID: "VND",
    ExchangeRate: 1.0,
    InvoiceStatusID: 1, // Mới tạo
    SignedDate: new Date().toISOString(),
  },
  ListInvoiceDetailsWS: [
    {
      ItemName: "Gói 500k",
      UnitName: "Gói",
      Qty: 1.0,
      Price: 500000,
      Amount: 500000,
      TaxRateID: 3, // 10%
      TaxAmount: 50000,
      IsDiscount: false,
      IsIncrease: null,
    },
  ],
  PartnerInvoiceStringID: "UYU150294",
  ListInvoiceAttachFileWS: attachments.length > 0 ? attachments : undefined, // Thêm tệp đính kèm nếu có
};

const createCommandData: CommandData = {
  CmdType: 100, // Tạo HĐ mới, eHD tự cấp InvoiceForm, InvoiceSerial; InvoiceNo = 0
  CommandObject: [createCommandObject],
};

// Tạo hóa đơn
async function runCreateInvoice() {
  const response = await createInvoice(config, createCommandData);
  if (response.success) {
    console.log("Hóa đơn được tạo thành công:", response.data);
  } else {
    console.error("Lỗi khi tạo hóa đơn:", response.error);
  }
}

runCreateInvoice();
```

## Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng để cải thiện thư viện này. Bạn có thể đóng góp bằng cách:

- Fork repository này.
- Tạo một nhánh mới cho tính năng hoặc sửa lỗi.
- Gửi Pull Request với mô tả chi tiết về các thay đổi.
