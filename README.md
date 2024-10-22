# ehoadon-bkav

[![npm version](https://badge.fury.io/js/ehoadon-bkav.svg)](https://badge.fury.io/js/ehoadon-bkav)
[![npm downloads](https://img.shields.io/npm/dt/ehoadon-bkav.svg)](https://www.npmjs.com/package/ehoadon-bkav)

`ehoadon-bkav` là một gói NPM đơn giản để tương tác với WebService Bkav eHoaDon, hỗ trợ việc gửi, nhận, và quản lý hóa đơn thông qua SOAP và mã hóa dữ liệu.

## Cài đặt

Bạn có thể cài đặt gói này bằng cách sử dụng NPM hoặc Yarn:

```bash
npm install ehoadon-bkav
```

Hoặc

```bash
yarn add ehoadon-bkav
```

## Cách sử dụng

### Ví dụ 1: Tạo hóa đơn mới

```typescript
import { execCommand } from "ehoadon-bkav";
import { Config, CommandDataCreateUpdate } from "./types";

const config: Config = {
  partnerGUID: "your-partner-guid",
  partnerToken: "your-partner-token", // Dạng "keyBase64:ivBase64"
  mode: "dev", // hoặc "prod" cho môi trường sản xuất
};

const commandData: CommandDataCreateUpdate = {
  CmdType: 100,
  CommandObject: [
    {
      Invoice: {
        InvoiceTypeID: 1,
        InvoiceDate: "2023-10-22",
        BuyerName: "Nguyễn Văn A",
        BuyerTaxCode: "0101234567",
        BuyerUnitName: "Công Ty TNHH ABC",
        BuyerAddress: "Số 1 Đường ABC, Quận XYZ, Hà Nội",
        BuyerBankAccount: "0123456789 - Ngân hàng XYZ",
        PayMethodID: 1,
        ReceiveTypeID: 3,
        ReceiverEmail: "nguyenvana@example.com",
        ReceiverMobile: "0912345678", // Số điện thoại 10 số
        ReceiverAddress: "Số 2 Đường DEF, Quận GHI, Hà Nội",
        ReceiverName: "Nguyễn Văn A",
        Note: "Test eHoaDon",
        BillCode: "HD123456",
        CurrencyID: "VND",
        ExchangeRate: 1.0,
        InvoiceForm: "",
        InvoiceSerial: "",
        InvoiceNo: 0,
        OriginalInvoiceIdentify: "",
      },
      ListInvoiceDetailsWS: [
        {
          ItemName: "Dịch vụ A",
          UnitName: "Gói",
          Qty: 1.0,
          Price: 1000000,
          Amount: 1000000,
          TaxRateID: 3,
          TaxRate: 10,
          TaxAmount: 100000,
          IsDiscount: false,
          IsIncrease: true,
          ItemTypeID: 1,
        },
      ],
      ListInvoiceAttachFileWS: [],
      PartnerInvoiceID: 123456,
      PartnerInvoiceStringID: "INV-123456",
    },
  ],
};

async function sendInvoice() {
  const result = await execCommand(config, commandData);
  if (result.success) {
    console.log("Hóa đơn đã được gửi thành công:", result.data);
  } else {
    console.error("Lỗi khi gửi hóa đơn:", result.error);
  }
}

sendInvoice();
```

### Ví dụ 2: Huỷ hoá đơn

```typescript
import { execCommand } from "ehoadon-bkav";
import { Config, CommandDataCancel } from "./types";

const config: Config = {
  partnerGUID: "your-partner-guid",
  partnerToken: "your-partner-token",
  mode: "prod", // Môi trường sản xuất
};

const commandData: CommandDataCancel = {
  CmdType: 202,
  CommandObject: [
    {
      PartnerInvoiceID: 123456,
      PartnerInvoiceStringID: "INV-123456",
    },
  ],
};

async function cancelInvoice() {
  const result = await execCommand(config, commandData);
  if (result.success) {
    console.log("Hóa đơn đã được huỷ thành công:", result.data);
  } else {
    console.error("Lỗi khi huỷ hoá đơn:", result.error);
  }
}

cancelInvoice();
```

### Ví dụ 3: Lấy thông tin hoá đơn

```typescript
import { execCommand } from "ehoadon-bkav";
import { Config, CommandDataInquiry } from "./types";

const config: Config = {
  partnerGUID: "your-partner-guid",
  partnerToken: "your-partner-token",
  mode: "prod",
};

const commandData: CommandDataInquiry = {
  CmdType: 800,
  CommandObject: "9ea9db57-b8c4-4149-9dce-2fd8b73712fd", // InvoiceGUID
};

async function getInvoiceDetails() {
  const result = await execCommand(config, commandData);
  if (result.success) {
    console.log("Chi tiết hóa đơn:", result.data);
  } else {
    console.error("Lỗi khi lấy thông tin hoá đơn:", result.error);
  }
}

getInvoiceDetails();
```

## Tham số

- `Config`: Cấu hình bao gồm `partnerGUID`, `partnerToken`, và chế độ `dev` hoặc `prod`.
- `CommandData`: Dữ liệu gửi đi cho hóa đơn, hủy hóa đơn hoặc các yêu cầu khác.

## License

MIT License © 2024 5Canh Softtech
