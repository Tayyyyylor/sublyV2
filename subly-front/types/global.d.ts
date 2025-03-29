export type Frequency = 'one' | 'hebdo' | 'monthly' | 'trimestriel' | 'yearly';

export type Event = {
    id: string
    name: string
    amount: number
    frequency: Frequency
    startDate: Date
}