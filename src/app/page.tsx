"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";

export default function Page() {
    const runtime = useChatRuntime({
        api: "/api/chat",
    });

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200 p-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        🗺️ Lietuvos OSM Asistentas
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        OpenStreetMap žymėjimo asistentas Lietuvoje
                    </p>
                </div>
            </header>
            <main className="flex-1 mx-auto w-full p-4">
                <AssistantRuntimeProvider runtime={runtime}>
                    <Thread />
                </AssistantRuntimeProvider>
            </main>
            <footer className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm text-gray-600">
                        Neradai atsakymo? Kreipkitės į{" "}
                        <a
                            href="https://lists.openstreetmap.org/listinfo/talk-lt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            OSM Talk LT bendruomenę
                        </a>
                    </p>
                    <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
                        <a
                            href="https://www.openstreetmap.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-700"
                        >
                            OpenStreetMap.org
                        </a>
                        <span>•</span>
                        <a
                            href="https://wiki.openstreetmap.org/wiki/Lithuania"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-700"
                        >
                            Lietuvos OSM Wiki
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};