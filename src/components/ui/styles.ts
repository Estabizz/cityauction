// Shared visual styles for public pages and account forms.
const fieldBase = "w-full min-w-0 rounded-xl border border-[#dce1e6] bg-white px-3.5 text-base sm:text-[15px] text-[#182129] outline-none transition placeholder:text-[#98a1ab] focus:border-[#84663c] focus:ring-4 focus:ring-[#b49361]/10 disabled:cursor-not-allowed disabled:opacity-60";
export const inputClass = `h-12 ${fieldBase}`;
export const textareaClass = `min-h-28 py-3 ${fieldBase}`;
export const labelClass = "mb-2 block text-sm font-medium text-[#182129]";
export const buttonBaseClass = "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#84663c] disabled:pointer-events-none disabled:opacity-60 cursor-pointer";
export const primaryButtonTone = "bg-[#132330] text-white hover:bg-[#253b4b]";
export const primaryButtonClass = `h-12 px-4 ${buttonBaseClass} ${primaryButtonTone}`;
export const cardClass = "rounded-3xl border border-[#e4e8ec] bg-white shadow-[0_8px_40px_-20px_rgba(24,33,41,0.18)]";
