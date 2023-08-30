import axios from "axios";
import keccak256 from "keccak256";

async function main() {
  const allownaceFrom = "0x82f7109e2d9E679Fc0fb16bF4d95F0366D580D0b";
  const allowanceTo = "0x5F90d10443B03F46a6c3513fe62F60733E7BceA7";
  const tokenAddress = "0xDa262dF44834127C792b350B52Ec56a2D15c59a4";
  const endpoint = "http://hq.gnd.devnet.kstadium.io:8545";
  const blockTag: "latest" | "earliest" | "pending" | number = "latest";

  let funcSelector = "0x";
  keccak256("allowance(address,address)").forEach((el, ind) => {
    if (ind > 3) return;
    funcSelector += el.toString(16);
  });

  const paddedAllownaceFrom = padLeft32Bytes(allownaceFrom, false);
  const paddedAllownaceTo = padLeft32Bytes(allowanceTo, false);
  const calldata = funcSelector + paddedAllownaceFrom + paddedAllownaceTo;

  const res = await axios({
    url: endpoint,
    method: "POST",
    data: {
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          to: tokenAddress.slice(2),
          data: calldata,
        },
        blockTag,
      ],
      id: 1,
    },
    headers: { "Content-Type": "application/json" },
  });

  const parsedRes = parseInt(res.data.result, 16);
  console.log(res.data);
  console.log(parsedRes);
}

function padLeft32Bytes(hex: string, withPrefix: boolean) {
  const padded = hex.replace("0x", "").padStart(64, "0");
  return withPrefix ? "0x" + padded : padded;
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
