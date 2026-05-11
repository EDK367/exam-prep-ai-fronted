export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function scoreToColor(score: number): string {
    if (score >= 80 && score <= 100) return 'success'
    if (score >= 60 && score < 80) return 'warning'
    if (score >= 30 && score < 60) return 'error'
    return 'danger'
}


export function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('es', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso))
}


export function getInitials(firstName: string, lastName: string): string {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
}