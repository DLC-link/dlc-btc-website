export async function setupXRPLVault(): Promise<string> {
  const setupXRPLVaultEndpoint = `/.netlify/functions/setup-xrpl-vault`;

  const response = await fetch(setupXRPLVaultEndpoint);
  return response.text();
}

export async function getAttestorGroupPublicKey(): Promise<string> {
  const getAttestorGroupPublicKeyEndpoint = `/.netlify/functions/fetch-attestor-group-public-key`;

  const response = await fetch(getAttestorGroupPublicKeyEndpoint);
  return response.text();
}
