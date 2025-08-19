"use client";

export default function LoadingSpinner() {
    return (
      <div className="flex flex-col justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-400"></div>
        <p className="text-stone-500 text-lg py-2">Loading data...</p>
      </div>
    );
  }