export function WebhookFallback() {
    return (
        <div className="relative mx-9 flex w-64 animate-pulse gap-2 p-4">
          <div className="h-5 w-9 rounded-lg bg-zinc-700"></div>
          <div className="flex-1 flex flex-col justify-around">
            <div className="mb-1 h-5 w-[80%] rounded-lg bg-zinc-700 text-lg"></div>
            <div className="h-3 w-[50%] rounded-lg bg-zinc-700 text-sm"></div>
          </div>
        </div>
    )
}