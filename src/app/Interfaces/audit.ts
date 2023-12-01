export interface Audit {
    id: number,
    operation_type: string,
    table_name: string,
    row_id: string,
    old_value: string,
    new_value: string,
    timestamp: string
}