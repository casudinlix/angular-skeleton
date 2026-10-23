export interface CursorPage<T> {readonly items:readonly T[];readonly nextCursor:string|null;}
export interface CursorQuery {readonly cursor?:string;readonly limit:number;readonly search?:string;}
