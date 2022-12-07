export const mkMenuItem = (label, position = 'left') => ({
    to: `/docs/${label}`,
    position,
    label
})