// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ConnectButton, DAppKitProvider } from "@mysten/dapp-kit-react";
import { dAppKit } from "./dapp-kit";

export default function ClientOnlyConnectButton() {
  return (
    <DAppKitProvider dAppKit={dAppKit}>
      <ConnectButton />
    </DAppKitProvider>
  );
}
