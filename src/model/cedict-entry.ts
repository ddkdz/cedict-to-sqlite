// Below is a line conforming to the CC-CEDICT format:
// 啤酒 啤酒 [pi2 jiu3] /beer (loanword)/CL:杯[bei1],瓶[ping2],罐[guan4],桶[tong3],缸[gang1]/
// it will be mapped to the props of CedictEntry like so:

export interface CedictEntry {
    traditional: string; // 啤酒
    simplified: string; // 啤酒
    pinyin: string; // [pi2 jiu3]
    translation: string; // /beer (loanword)/CL:杯[bei1],瓶[ping2],罐[guan4],桶[tong3],缸[gang1]/
}

export type CedictEntries = CedictEntry[];