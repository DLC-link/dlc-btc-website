import { useState } from 'react';

interface UseCopyToClipboardReturnType {
  hasCopied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
}

export function useCopyToClipboard(): UseCopyToClipboardReturnType {
  const [hasCopied, setHasCopied] = useState(false);

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  }

  return {
    hasCopied,
    copyToClipboard,
  };
}
