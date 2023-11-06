import { expect, test } from "vitest";

import { easyTruncateAddress } from "../../src/app/common/utilities";

test("address is truncated correctly", () => {
  const address = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
  const truncated = easyTruncateAddress(address);
  expect(truncated).toBe("bc1q...5mdq");
});
