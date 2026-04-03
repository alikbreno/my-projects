import { CopyIcon } from 'lucide-react'
import { IconButton } from './ui/icon-button'
import { WebhooksList } from './webhooks-list'
import { Suspense } from 'react'
import { WebhookFallback } from './webhookFallback'

export function Sidebar() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-5">
        <div className="lg:flex items-baseline">
          <div className="font-semibold text-zinc-100">webhook</div>
          <div className="font-normal text-zinc-400 lg:p-0 pl-2">.inspect</div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-2.5">
        <div className="flex-1 min-w-0 flex items-center gap-1 text-xs font-mono text-zinc-300">
          <span className="truncate">https://example.com/webhook</span>
        </div>
        <IconButton icon={<CopyIcon className="size-4" />} />
      </div>

      <Suspense fallback={<WebhookFallback />}>
        <WebhooksList />
      </Suspense>
    </div>
  )
}
