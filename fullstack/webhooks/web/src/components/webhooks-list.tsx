import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { WebhooksListItem } from "./webhooks-list-item";
import { webhookListSchema } from "../http/schemas/webhooks";
import { Loader2, Wand2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CodeBlock } from "./ui/code-block";

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>(null);

  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([]);
  const [generatedHandlerCode, setGeneratedHandlerCode] = useState<
    string | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["webhooks"],
      queryFn: async ({ pageParam }) => {
        const url = new URL("https://webhookinspectorapi.onrender.com/api/webhooks");

        if (pageParam) {
          url.searchParams.set("cursor", pageParam);
        }

        const response = await fetch(url);
        const data = await response.json();

        return webhookListSchema.parse(data);
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined;
      },
      initialPageParam: undefined as string | undefined,
    });

  const webhooks = data.pages.flatMap((page) => page.webhooks);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function heandleCheckedWebhook(checkedWebhookId: string) {
    if (checkedWebhooksIds.includes(checkedWebhookId)) {
      setCheckedWebhooksIds((state) => {
        return state.filter((webhookId) => webhookId !== checkedWebhookId);
      });
    } else {
      setCheckedWebhooksIds((state) => [...state, checkedWebhookId]);
    }
  }

  async function handleGenerateHandler() {
    setIsGenerating(true);

    try {
      const response = await fetch("https://webhookinspectorapi.onrender.com/api/generate", {
        method: "POST",
        body: JSON.stringify({ webhookIds: checkedWebhooksIds }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      type GenerateResponse = { code: string };

      const data: GenerateResponse = await response.json();

      setGeneratedHandlerCode(data.code);
    } finally {
      setIsGenerating(false);
    }
  }

  const hasAnyWebhookChecked = checkedWebhooksIds.length > 0;

  return (
    <>
    <div className="p-2">
      <button
        disabled={!hasAnyWebhookChecked || isGenerating}
        className="bg-indigo-400 text-white w-full cursor-pointer rounded-lg flex items-center justify-center gap-3 font-medium text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handleGenerateHandler()}
      >
        {isGenerating ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Wand2 className="size-4" />
        )}
        {isGenerating ? "Generating..." : "Generate handler"}
      </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-custom">
        <div className="space-y-1 p-2">
          {webhooks.map((webhook) => (
            <WebhooksListItem
              key={webhook.id}
              webhook={webhook}
              onWebhookChecked={heandleCheckedWebhook}
              isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}
            />
          ))}
        </div>

        {hasNextPage && (
          <div className="p-2" ref={loadMoreRef}>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="size-5 text-zinc-500 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {!!generatedHandlerCode && (
        <Dialog.Root
          defaultOpen
          onOpenChange={(open) => {
            if (!open) {
              setGeneratedHandlerCode(null);
            }
          }}
        >
          <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />

          <Dialog.Content className="flex items-center justify-center fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 z-40">
            <div className="bg-zinc-900 w-auto p-4 rounded-lg border border-zinc-800 max-h-155 overflow-y-auto relative">
              <Dialog.Title className="sr-only">
                Generated Webhook Handler
              </Dialog.Title>
              <Dialog.Close
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-100"
                aria-label="Close dialog"
                title="Close dialog"
              >
                <X className="size-5" />
              </Dialog.Close>
              <CodeBlock language="typescript" code={generatedHandlerCode} />
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  );
}
