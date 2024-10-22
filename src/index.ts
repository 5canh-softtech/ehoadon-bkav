import axios from "axios";
import crypto from "crypto";
import zlib from "zlib";
import { parseStringPromise } from "xml2js";
import { Config, CommandData, ResponseBase } from "./types";

function encryptData(buffer: Buffer, token: string): string {
  const [keyBase64, ivBase64] = token.split(":");
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  cipher.setAutoPadding(true);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted.toString("base64");
}

function decryptData(encryptedDataBase64: string, token: string): Buffer {
  const [keyBase64, ivBase64] = token.split(":");
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const encryptedBuffer = Buffer.from(encryptedDataBase64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  decipher.setAutoPadding(true);
  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);
  return decrypted;
}

function zipData(data: string): Buffer {
  return zlib.gzipSync(data);
}

function unzipData(buffer: Buffer): string {
  return zlib.gunzipSync(buffer).toString("utf8");
}

function createSOAPRequest(
  partnerGUID: string,
  encryptedCommandData: string
): string {
  return `
 <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <ExecCommand xmlns="http://tempuri.org/">
          <partnerGUID>${partnerGUID}</partnerGUID>
          <CommandData>${encryptedCommandData}</CommandData>
        </ExecCommand>
      </soap:Body>
    </soap:Envelope>`;
}

async function sendSOAPRequest(
  soapRequest: string,
  endpoint: string
): Promise<string> {
  const response = await axios.post(endpoint, soapRequest, {
    headers: { "Content-Type": "text/xml" },
  });

  const parsedResponse = await parseStringPromise(response.data, {
    explicitArray: false,
  });
  const execCommandResult =
    parsedResponse["soap:Envelope"]["soap:Body"]["ExecCommandResponse"][
      "ExecCommandResult"
    ];

  return execCommandResult;
}

function getEndpoint(mode: "dev" | "prod") {
  return mode === "prod"
    ? "https://ws.ehoadon.vn/WSPublicEHoaDon.asmx"
    : "https://wsdemo.ehoadon.vn/WSPublicEHoaDon.asmx";
}

export async function execCommand(
  config: Config,
  data: CommandData
): Promise<ResponseBase> {
  try {
    const { partnerGUID, partnerToken, mode = "dev" } = config;
    const endpoint = getEndpoint(mode);

    const jsonData = JSON.stringify(data);

    const zippedBuffer = zipData(jsonData);

    const encryptedData = encryptData(zippedBuffer, partnerToken);

    const soapRequest = createSOAPRequest(partnerGUID, encryptedData);

    const execCommandResult = await sendSOAPRequest(soapRequest, endpoint);

    const decryptedBuffer = decryptData(execCommandResult, partnerToken);

    const unzippedData = unzipData(decryptedBuffer);

    const jsonDataResult = JSON.parse(unzippedData);

    return { success: true, data: jsonDataResult };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
