import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export interface GetTransactionsType extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        from: number;
        to: number;
    }
}