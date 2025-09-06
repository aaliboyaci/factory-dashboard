import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/tr'
dayjs.extend(relativeTime)
dayjs.locale('tr')

export const fmtPct = (n) => `${(n ?? 0).toFixed(1)}%`
export const fmtNum = (n) => (n ?? 0).toLocaleString('tr-TR')
export const timeAgo = (iso) => (iso ? dayjs(iso).fromNow() : '-')
