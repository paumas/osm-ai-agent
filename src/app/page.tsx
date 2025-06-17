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
            {/* Header */}
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

            {/* Welcome message overlay for first visit */}
            <div className="hidden" id="welcome-overlay">
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                            {/*<MarkdownText content={WELCOME_MESSAGE} />*/}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => document.getElementById('welcome-overlay')?.classList.add('hidden')}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Pradėti
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};